const connection = require('../db/connection');

function selectUsers(req) {
  let whereObj = {};
  Object.assign(whereObj, req.params);
  
  const userFields = ['username', 'avatar_url', 'name'];

  return connection
    .select(...userFields)
    .from('users')
    .where(whereObj);
}

module.exports = selectUsers;
