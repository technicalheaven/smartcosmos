const toSecureTagMapS = (tag:any) => {
  const {
    _id: tagId,
    bId: batchId,
    seq: sequence,
    secureKey:skey,
    lastValidCounter,
    activated,
    tamperTag = false
  } = tag

  const ndef = tag.ndef || ''
  const tagUrl = tag.tagUrl || ''

  return {
    tagId,
    batchId,
    sequence: sequence || 0,
    skey,
    lastValidCounter: lastValidCounter,
    activated: activated && activated !== '0',
    tamperTag,
    ndef,
    tagUrl
  }
}

module.exports = {toSecureTagMap: toSecureTagMapS }
