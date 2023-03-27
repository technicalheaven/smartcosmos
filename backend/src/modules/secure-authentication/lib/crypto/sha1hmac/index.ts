
import crypto from 'crypto';

const calculate = (cnt:any, uid:any, key:any, tt:any) => {
  return crypto.createHmac('sha1', key)
    .update(uid)
    .update(cnt)
    .digest();
};

const validate = (cnt:any, uid:any, key:any, sig:any, tt:any) => {
  if (sig.equals(calculate(cnt, uid, key, tt))) {
    return true;
  }

  const swappedKey = key;
  for (let i = 0; i < 8; i++) {
    const dword = swappedKey.readUInt32LE(i * 4);
    swappedKey.writeUInt32BE(dword, i * 4);
  }

  return sig.equals(calculate(cnt, uid, swappedKey, tt));
};

export default {
  validate
};
