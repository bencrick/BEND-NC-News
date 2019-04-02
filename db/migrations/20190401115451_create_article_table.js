const makeTimestamp = require('../../utils/makeTimestamp');

exports.up = function(knex, Promise) {
  // console.log('creating article table...');
  return knex.schema.createTable('articles', articleTable => {
    articleTable.increments('article_id').primary();
    articleTable.string('title');
    articleTable.text('body');
    articleTable.integer('votes').defaultTo(0);
    articleTable.string('topic');
    articleTable.string('author').references('users.username');
    articleTable.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  // console.log('removing article table...');
  return knex.schema.dropTable('articles');
};
