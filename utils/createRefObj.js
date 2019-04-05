function createRefObj(objArr, keyProp, valProp) {
  return objArr.reduce(
    (acc, cv) => ({ ...acc, [cv[keyProp]]: cv[valProp] }),
    {}
  );
}

module.exports = createRefObj;
