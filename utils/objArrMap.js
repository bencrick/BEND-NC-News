function objArrMap(objArr, prop, cb) {
  outObjArr = JSON.parse(JSON.stringify(objArr))
  outObjArr.forEach(obj => {
    obj[prop] = cb(obj[prop])
  })
  return outObjArr
}

module.exports = objArrMap