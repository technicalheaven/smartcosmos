const NfcDecoder = require('../dist');
const logger = require('./../../../libs/logger')


const ensureUri = (ndef:any) => {
  let tagUri = ''
  if (ndef) {
    try {
      tagUri = NfcDecoder.getUriFromNdefMessage(Buffer.from(ndef, 'hex')) || ''
    } catch (error) {
      logger.error('Problem decoding ndef', error)
    }
  }
  return tagUri
}

module.exports = { ensureUri }
