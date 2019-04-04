const connection = require('../db/connection');
const {
  objRenameKey,
  selectTableColValues,
  noRowsThrow404
} = require('../utils');

async function modifyComments(req) {
  const whereObj = {};
  Object.assign(whereObj, req.query);
  Object.assign(whereObj, req.params);
  const updateObj = req.body;

  for (prop in updateObj) {
    if (/^inc_/.test(prop)) {
      const updateProp = prop.replace(/^inc_/, '');
      const currentRows = await selectTableColValues(
        connection,
        'comments',
        updateProp,
        whereObj
      );
      const updateValue = currentRows[0][updateProp];
      updateObj[updateProp] = updateObj[prop] + updateValue;
      delete updateObj[prop];
    }
  }
  return connection('comments')
    .where(whereObj)
    .update(updateObj)
    .returning('*');
}

async function removeComments(req) {
  const whereObj = {};
  Object.assign(whereObj, req.query);
  Object.assign(whereObj, req.params);

  await noRowsThrow404(connection, 'comments', whereObj);

  return connection('comments')
    .where(whereObj)
    .del();
}

module.exports = { modifyComments, removeComments };
