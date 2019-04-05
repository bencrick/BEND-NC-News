const connection = require('../db/connection');

function selectTopics() {
  return connection.select('*').from('topics');
}

module.exports = { selectTopics };
