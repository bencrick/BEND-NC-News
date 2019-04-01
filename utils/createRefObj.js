function createRefObj(objArr, keyProp, valProp) {
  const refObj = {};
  objArr.forEach(obj => (refObj[obj[keyProp]] = obj[valProp]));
  return refObj;
}

module.exports = createRefObj;
