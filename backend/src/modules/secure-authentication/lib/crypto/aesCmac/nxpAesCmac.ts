
import crypto from 'crypto';

/**
 * Crypto engine for NXP DESFire EV2 based products
 *
 * This class encapsulates:
 *  - AES-128 encryption
 *  - AES-CMAC calculation (according to RFC 4493)
 *  - NXP-CMAC calculation (NXP proprietary, uses odd bytes from AES-CMAC only)
 *
 *  Verifying a NTAG4xx signature:
 *  1. Concat "3CC300010080" + uid (7 bytes) + counter (3 bytes), all values LSB first, store in 'message'
 *  2. Calculate the AES-CMAC of the message with the secret key, store in 'kss' (cmacStandard)
 *  3. Calculate the NXP-CMAC of a zero bytes message with kss as key, truncate by using odd bytes only (cmacMifarePlus)
 */

const KEY_LENGTH = 16;
const SIG_LENGTH = 8;
const IV = Buffer.alloc(KEY_LENGTH);

/**
 * Encrypt a plain text with given key using AES-128
 *
 * @param key   encryption key
 * @param plain plain text
 * @return      cipher text
 */
const encrypt = (key:any, plain:any) => {
  const aes = crypto.createCipheriv('aes-128-cbc', key, IV);
  aes.setAutoPadding(false);
  return aes.update(plain);
};

/**
 * Decrypt a cipher text with given key using AES-128
 *
 * @param key   decryption key
 * @param cipherText cipher text
 * @return      plain text
 */
const decrypt = (key:any, cipherText:any) => {
  const aes = crypto.createDecipheriv('aes-128-cbc', key, IV);
  aes.setAutoPadding(false);
  return aes.update(cipherText);
};

/**
 * Calculate the AES-CMAC for the given input with given key by using AES-128
 *
 * @param key   encryption key
 * @param input input bytes
 * @return cmac
 */
const cmacStandard = (key:any, input:any) => {
  let block = Buffer.alloc(KEY_LENGTH);
  let x = Buffer.alloc(KEY_LENGTH);
  let y;
  let mLast;
  let n;
  let requiresPadding;

  const subKeys:any = generateSubKeys(key);
  n = (input.length + 15) >> 4; // n = (input.length + 15) / KEY_LENGTH; n is number of rounds
  if (n === 0) {
    n = 1;
    // when the message is empty use a full padding block
    requiresPadding = true;
  } else {
    // set padding flag when the last block is incomplete
    requiresPadding = (input.length & 0x0F) !== 0;
  }
  if (!requiresPadding) { // last block is complete block
    input.copy(block, 0, KEY_LENGTH * (n - 1), KEY_LENGTH * n);
    mLast = xor128(block, subKeys.k1);
  } else {
    const partialLen = input.length % KEY_LENGTH;
    const partialBlock = input.slice(KEY_LENGTH * (n - 1), KEY_LENGTH * (n - 1) + partialLen);
    const padded = padding(partialBlock);
    mLast = xor128(padded, subKeys.k2);
  }
  for (let i = 0; i < n - 1; i++) {
    input.copy(block, 0, KEY_LENGTH * i, KEY_LENGTH * (i + 1));
    y = xor128(x, block);     // Y := Mi (+) X
    x = encrypt(key, y);      // X := AES-128(KEY, Y);
  }
  y = xor128(x, mLast);
  x = encrypt(key, y);
  return x;
};

/**
 * Calculate the AES-CMAC for the given input with given key by using AES-128
 *
 * @param key   encryption key
 * @param input input bytes
 * @return truncated cmac (contains only odd bytes from the normal default cmac)
 */
const cmacMifarePlus = (key:any, input:any) => {
  const cmac = cmacStandard(key, input);
  const mfCmac = Buffer.alloc(SIG_LENGTH);
  for (let i = 0; i < SIG_LENGTH; i++) {
    mfCmac[i] = cmac[1 + 2 * i];
  }
  return mfCmac;
};

const generateSubKeys = (key:any) => {
  const constRb = Buffer.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x87]);
  const subKeys:any = {};
  const m = encrypt(key, IV);

  if ((m[0] & 0x80) === 0) { /* If MSB(L) = 0, then K1 = L << 1 */
    subKeys.k1 = leftShiftOneBit(m);
  } else {    /* Else K1 = ( L << 1 ) (+) Rb */
    subKeys.k1 = xor128(leftShiftOneBit(m), constRb);
  }

  if ((subKeys.k1[0] & 0x80) === 0) {
    subKeys.k2 = leftShiftOneBit(subKeys.k1);
  } else {
    subKeys.k2 = xor128(leftShiftOneBit(subKeys.k1), constRb);
  }
  return subKeys;
};

const padding = (input:any) => {
  const inLen = input.length;
  const padLen = KEY_LENGTH - (inLen % KEY_LENGTH);
  const output = Buffer.alloc(inLen + padLen);
  input.copy(output, 0, 0, inLen);
  for (let i = 0; i < padLen; i++) {
    output[inLen+i] = (i === 0) ? 0x80 : 0x00;
  }
  return output;
};

const leftShiftOneBit = (input:any) => {
  let overflow = 0;
  const output = Buffer.alloc(KEY_LENGTH);
  for (let i = 15; i >= 0; i--) {
    output[i] = ((input[i] << 1) & 0xFF) | overflow;
    overflow = (input[i] & 0x80) ? 1 : 0;
  }
  return output;
};

const xor128 = (a:any, b:any) => {
  const c = Buffer.alloc(KEY_LENGTH);
  for (let i = 0; i < KEY_LENGTH; i++) {
    c[i] = a[i] ^ b[i];
  }
  return c;
};

export {
  encrypt,
  decrypt,
  cmacStandard,
  cmacMifarePlus,
  generateSubKeys,
  padding,
  leftShiftOneBit,
  xor128
};
