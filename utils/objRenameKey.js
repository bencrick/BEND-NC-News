function objRenameKey(obj, beforeKey, afterKey) {
  const newObj = { ...obj };
  newObj[afterKey] = obj[beforeKey];
  delete newObj[beforeKey];
  return newObj;
}

module.exports = objRenameKey;
