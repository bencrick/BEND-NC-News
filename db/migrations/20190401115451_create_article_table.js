const makeTimestamp = require('../../utils/makeTimestamp');

exports.up = function(knex, Promise) {
  // console.log('creating article table...');
  return knex.schema.createTable('articles', articleTable => {
    articleTable.increments('article_id').primary();
    articleTable.string('title').notNullable();
    articleTable.text('body').notNullable();
    articleTable.integer('votes').defaultTo(0);
    articleTable.string('topic').references('topics.slug');
    articleTable
      .string('author')
      .references('users.username')
      .onDelete('CASCADE');
    articleTable.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  // console.log('removing article table...');
  return knex.schema.dropTable('articles');
};
