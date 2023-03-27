import { InvalidKeyException, InvalidAlgorithmParameterException, IllegalStateException } from '../exceptions';

// Mutual Irregular Clocking KEYstream generator (MICKEY) is a stream cipher algorithm

const mickey = {
  R: new Array(4),
  S: new Array(4),
};

const ENCRYPT_MODE = 1;
const KEY_LEN = 10;

// mutable initialization value
let initialized = false;

// bit mask constants defined in spec, chapter 4.2 and 4.3
const R_Mask = [0x1d5363d5, 0x415a0aac, 0x0000d2a8];
const Comp0 = [0x6aa97a30, 0x7942a809, 0x00003fea];
const Comp1 = [0xdd629e9a, 0xe3a21d63, 0x00003dd7];
const S_Mask0 = [0x9ffa7faf, 0xaf4a9381, 0x00005802];
const S_Mask1 = [0x4c8cb877, 0x4911b063, 0x0000c52b];

/**
 * CLOCK_R function for Clocking the register R
 *
 * @param {Mickey} { R }
 * @param {number} inputBit
 * @param {number} controlBit
 */
const CLOCK_R = ({ R }:any, inputBit:any, controlBit:any) => {
  const feedbackBit = (shiftR(R[2], 15) & 1) ^ inputBit;
  const carry0 = shiftR(R[0], 31) & 1;
  const carry1 = shiftR(R[1], 31) & 1;

  if (controlBit) {
    // Shift and xor
    R[0] ^= R[0] << 1;
    R[1] ^= (R[1] << 1) ^ carry0;
    R[2] ^= (R[2] << 1) ^ carry1;
  } else {
    // Shift only
    R[0] = R[0] << 1;
    R[1] = (R[1] << 1) ^ carry0;
    R[2] = (R[2] << 1) ^ carry1;
  }

  // Implement feedback into the various register stages
  if (feedbackBit) {
    R[0] ^= R_Mask[0];
    R[1] ^= R_Mask[1];
    R[2] ^= R_Mask[2];
  }
};

/**
 * CLOCK_S function for Clocking the register S
 *
 * @param {Mickey} { S }
 * @param {number} inputBit
 * @param {number} controlBit
 */
const CLOCK_S = ({ S }:any, inputBit:any, controlBit:any) => {
  const feedbackBit = (shiftR(S[2], 15) & 1) ^ inputBit;
  const carry0 = shiftR(S[0], 31) & 1;
  const carry1 = shiftR(S[1], 31) & 1;

  S[0] = (S[0] << 1) ^ ((S[0] ^ Comp0[0]) & (shiftR(S[0], 1) ^ (S[1] << 31) ^ Comp1[0]) & 0xfffffffe);
  S[1] = (S[1] << 1) ^ ((S[1] ^ Comp0[1]) & (shiftR(S[1], 1) ^ (S[2] << 31) ^ Comp1[1])) ^ carry0;
  S[2] = (S[2] << 1) ^ ((S[2] ^ Comp0[2]) & (shiftR(S[2], 1) ^ Comp1[2]) & 0x7fff) ^ carry1;

  // Apply suitable feedback from s_79
  if (feedbackBit) {
    if (controlBit) {
      S[0] ^= S_Mask1[0];
      S[1] ^= S_Mask1[1];
      S[2] ^= S_Mask1[2];
    } else {
      S[0] ^= S_Mask0[0];
      S[1] ^= S_Mask0[1];
      S[2] ^= S_Mask0[2];
    }
  }
};

/**
 * CLOCK_KG function for clocking the overall register
 *
 * @param {Mickey} mickey
 * @param {boolean} mixing
 * @param {number} inputBit
 * @returns {number}
 */
const CLOCK_KG = (mickey:any, mixing:any, inputBit:any) => {
  let { R, S } = mickey;
  const keystreamBit = (R[0] ^ S[0]) & 1;
  const controlBitR = (shiftR(S[0], 27) ^ shiftR(R[1], 21)) & 1;
  const controlBitS = (shiftR(S[1], 21) ^ shiftR(R[0], 26)) & 1;

  if (mixing) {
    CLOCK_R(mickey, (shiftR(S[1], 8) & 1) ^ inputBit, controlBitR);
  } else {
    CLOCK_R(mickey, inputBit, controlBitR);
  }

  CLOCK_S(mickey, inputBit, controlBitS);

  return keystreamBit;
};

/**
 * setup function for Key loading and initialisation
 *
 * @param {Mickey} mickey
 * @param {Int8Array} key
 * @param {Int8Array} initVariable
 */
const setup = (opmode:any, mickey:any, key:any, initVariable:any) => {
  if (opmode !== ENCRYPT_MODE) {
    throw new InvalidKeyException('Only ENCRYPT_MODE is supported in this implementation.');
  }

  if (!key || key.length !== KEY_LEN) {
    throw new InvalidKeyException('Mickey keys must have 10 bytes size.');
  }

  if (!initVariable || initVariable.length === 0) {
    throw new InvalidAlgorithmParameterException('Mickey initVector must be not empty.');
  }

  const ivSize = initVariable.length << 3;
  let initVariableOrKeyBit;
  let { R, S } = mickey;

  // Initialize R and S to all zeros
  for (let i = 0; i < 3; i++) {
    R[i] = 0;
    S[i] = 0;
  }

  // Load in IV
  for (let i = ivSize - 1; i >= 0; i--) {
    initVariableOrKeyBit = (initVariable[i >>> 3] >>> (7 - (i & 7))) & 1;
    CLOCK_KG(mickey, true, initVariableOrKeyBit);
  }

  // Load in K
  for (let i = 79; i >= 0; i--) {
    initVariableOrKeyBit = (key[i >>> 3] >>> (7 - (i & 7))) & 1;
    CLOCK_KG(mickey, true, initVariableOrKeyBit);
  }

  // Preclock
  for (let i = 0; i < 80; i++) {
    CLOCK_KG(mickey, true, 0);
  }

  initialized = true;
};

const generateKeyStream = (key:any, initVariable:any, input:any) => {
  let reg;
  let feedbackBit;
  let carry0, carry1;
  let controlBitR;
  let controlBitS;
  let { R, S } = mickey;

  setup(1, mickey, key, initVariable);

  if (!initialized) {
    throw new IllegalStateException('Cannot encrypt without prior initialization.');
  }

  const cipherText = Buffer.alloc(input.length);

  for (let i = 0; i < input.length; i++) {
    reg = input[i];

    for (let s = 7; s >= 0; s--) {
      reg ^= ((R[0] ^ S[0]) & 1) << s;

      controlBitR = ((S[0] >>> 27) ^ (R[1] >>> 21)) & 1;
      controlBitS = ((S[1] >>> 21) ^ (R[0] >>> 26)) & 1;

      feedbackBit = (R[2] >>> 15) & 1;
      carry0 = (R[0] >>> 31) & 1;
      carry1 = (R[1] >>> 31) & 1;

      if (controlBitR !== 0) {
        R[0] ^= R[0] << 1;
        R[1] ^= (R[1] << 1) ^ carry0;
        R[2] ^= (R[2] << 1) ^ carry1;
      } else {
        R[0] <<= 1;
        R[1] = (R[1] << 1) ^ carry0;
        R[2] = (R[2] << 1) ^ carry1;
      }

      if (feedbackBit !== 0) {
        R[0] ^= R_Mask[0];
        R[1] ^= R_Mask[1];
        R[2] ^= R_Mask[2];
      }

      feedbackBit = (S[2] >>> 15) & 1;
      carry0 = (S[0] >>> 31) & 1;
      carry1 = (S[1] >>> 31) & 1;

      S[0] = (S[0] << 1) ^ ((S[0] ^ Comp0[0]) & ((S[0] >>> 1) ^ (S[1] << 31) ^ Comp1[0]) & 0xfffffffe);
      S[1] = (S[1] << 1) ^ ((S[1] ^ Comp0[1]) & ((S[1] >>> 1) ^ (S[2] << 31) ^ Comp1[1])) ^ carry0;
      S[2] = (S[2] << 1) ^ ((S[2] ^ Comp0[2]) & ((S[2] >>> 1) ^ Comp1[2]) & 0x7fff) ^ carry1;

      if (feedbackBit) {
        if (controlBitS) {
          S[0] ^= S_Mask1[0];
          S[1] ^= S_Mask1[1];
          S[2] ^= S_Mask1[2];
        } else {
          S[0] ^= S_Mask0[0];
          S[1] ^= S_Mask0[1];
          S[2] ^= S_Mask0[2];
        }
      }
    }
    cipherText[i] = Number(reg);
  }

  return cipherText;
};

const shiftR = (digit:any, shift:any) => digit >>> shift;

const validate = (cnt:any, uid:any, key:any, sig:any, tt:any) => {
  // feed MICKEY with 96 clocks if IC version is >= v3 and TT is non-zero, compare last 4 bytes
  //let validateSecuredTamper = tt && tt.readUInt8(0) !== 0 && (uid[2] & 0x0F >= 0x03);
  let validateSecuredTamper = tt && tt.readUInt8(0) !== 0 && (uid[2] && 0x0F >= 0x03);
  if (validateSecuredTamper) {
    const buf = generateKeyStream(new Int8Array(key), new Int8Array(cnt),  new Int8Array(12));
    return sig.equals(buf.slice(8));
  }
  return sig.equals(generateKeyStream(new Int8Array(key), new Int8Array(cnt),  new Int8Array(4)));
};

export default {
  validate
};
