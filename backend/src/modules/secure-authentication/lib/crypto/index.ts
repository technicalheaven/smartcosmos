
import AesCmac from './aesCmac';
import Counter from './counter';
import Mickey from './mickey';
import Sha1Hmac from './sha1hmac';

const crypto = {
  aesCmac: {
    name: 'AES-CMAC',
    cntLength: 6,
    keyLength: 32,
    sigLength: 16,
    ttLength: 0,
    validate: AesCmac.validate
  },
  counter: {
    name: 'COUNTER',
    cntLength: 6,
    keyLength: 0,
    sigLength: 0,
    ttLength: 8,
    validate: Counter.validate
  },
  mickey: {
    name: 'MICKEY',
    cntLength: 8,
    keyLength: 20,
    sigLength: 8,
    ttLength: 2,
    validate: Mickey.validate
  },
  sha1hmac: {
    name: 'SHA1HMAC',
    cntLength: 6,
    keyLength: 64,
    sigLength: 40,
    ttLength: 0,
    validate: Sha1Hmac.validate
  }
};

export default crypto;
