function makeTimestamp(milliseconds) {
  const d = new Date(milliseconds);
  const dObj = {};
  dObj.months = String(d.getMonth()+1);
  dObj.date = String(d.getDate());
  dObj.hours = String(d.getHours());
  dObj.minutes = String(d.getMinutes());
  dObj.seconds = String(d.getSeconds());
  for (prop in dObj) {
    while (dObj[prop].length < 2) {
      dObj[prop] = `0${dObj[prop]}`;
    }
  }
  dObj.years = String(d.getFullYear());
  while (dObj.years.length < 4) {
    dObj.years = `0${dObj.years}`;
  }
  return `${dObj.years}-${dObj.months}-${dObj.date} ${dObj.hours}:${
    dObj.minutes
  }:${dObj.seconds}`;
}

module.exports = makeTimestamp;
