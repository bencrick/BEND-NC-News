const selectTableColValues = require('./selectTableColValues');

async function noRowsThrow404(connection, table, whereObj) {
  const currentRows = await selectTableColValues(
    connection,
    table,
    '*',
    whereObj
  );
  if (currentRows.length === 0) {
    throw { code: 404 };
  }
}

module.exports = noRowsThrow404;
