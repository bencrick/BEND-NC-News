exports.up = function(knex, Promise) {
  console.log('creating comment table...');
  return knex.schema.createTable('comments', commentTable => {
    commentTable.increments('comment_id').primary();
    commentTable.string('author').references('users.username');
    commentTable.string('article_id').references('articles.article_id');
    commentTable.integer('votes').defaultTo(0);
    commentTable.timestamp('created_at').defaultTo(knex.fn.now());
    commentTable.string('body');
  });
};

exports.down = function(knex, Promise) {
  console.log('removing comment table...');
  return knex.schema.dropTable('comments');
};
