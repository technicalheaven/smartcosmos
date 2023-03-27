const supportedTypes = [
  'UHF', 'HF', 'LF' // UHF needs to be the first element!
]

function getProductTypeForLegacyData (inlayType:any) {
  if (!inlayType) {
    return null
  }

  for (let type of supportedTypes) {
    if (inlayType.includes(type)) {
      return type
    }
  }

  return null
}

module.exports = {
  getProductTypeForLegacyData
}
