const connection = require('../db/connection');
const { objRenameKey, selectTableColValues } = require('../utils');

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

  const currentRows = await selectTableColValues(connection, 'comments', 'comment_id', whereObj)

  if (currentRows.length === 0) {
    throw { code: 404 }
  }

  return connection('comments')
    .where(whereObj)
    .del();
}

module.exports = { modifyComments, removeComments };
