const connection = require('../db/connection');

function selectUser(params) {
  const userFields = ['username', 'avatar_url', 'name'];
  return connection
    .select(...userFields)
    .from('users')
    .where(params);
}

module.exports = selectUser;
