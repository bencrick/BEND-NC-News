exports.up = function(knex, Promise) {
  // console.log('creating topic table...');
  return knex.schema.createTable('topics', topicTable => {
    topicTable.string('slug').primary();
    topicTable.string('description');
  });
};

exports.down = function(knex, Promise) {
  // console.log('removing topic table...');
  return knex.schema.dropTable('topics');
};
