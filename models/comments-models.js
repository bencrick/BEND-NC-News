const connection = require('../db/connection');
const {
  objRenameKey,
  selectTableColValues,
  noRowsThrow404
} = require('../utils');

function modifyComments(params, updateObj) {
  const incrementObj = {};
  for (prop in updateObj) {
    if (/^inc_/.test(prop)) {
      incrementObj[prop.replace(/^inc_/, '')] = updateObj[prop];
      delete updateObj[prop];
    }
  }
  const connectionPromise = connection('comments')
    .where(params)
    .returning('*');

  if (Object.keys(incrementObj).length > 0) {
    connectionPromise.increment(incrementObj);
  }
  if (Object.keys(updateObj).length > 0) {
    connectionPromise.update(updateObj);
  }

  return connectionPromise;
}

function removeComments(params) {
  return connection('comments')
    .where(params)
    .del();
}

module.exports = { modifyComments, removeComments };
