function objHasKeys(obj, keys) {
  return keys.every(key => obj.hasOwnProperty(key))
}

module.exports = objHasKeys