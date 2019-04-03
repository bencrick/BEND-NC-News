function selectTableColValues(connection, table, column, whereObj) {
  return connection
    .select(column)
    .from(table)
    .where(whereObj);
}

module.exports = selectTableColValues