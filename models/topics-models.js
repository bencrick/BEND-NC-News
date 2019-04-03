const connection = require('../db/connection');

function selectTopics(req) {
  return connection.select('*').from('topics');
}

module.exports = { selectTopics };
