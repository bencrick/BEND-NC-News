const { articles, comments, topics, users } = require('../data');
const {
  createRefObj,
  makeTimestamp,
  objArrMap,
  objRenameKey
} = require('../../utils');

exports.seed = (knex, Promise) => {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      // console.log('inserting topic data...')
      return knex('topics')
        .insert(topics)
        .returning('*');
    })
    .then(topicRows => {
      // console.log('inserting user data...');
      return knex('users')
        .insert(users)
        .returning('*');
    })
    .then(userRows => {
      const articlesToInsert = articles.map(
        ({ created_at, ...articleDatum }) => {
          return {
            created_at: new Date(created_at),
            ...articleDatum
          };
        }
      );
      // console.log('inserting article data...');
      return knex('articles')
        .insert(articlesToInsert)
        .returning('*');
    })
    .then(articleRows => {
      const refArticleTitleToId = createRefObj(
        articleRows,
        'title',
        'article_id'
      );
      const commentsToInsert = comments.map(
        ({ created_at, created_by, belongs_to, ...commentDatum }) => {
          return {
            created_at: new Date(created_at),
            author: created_by,
            article_id: refArticleTitleToId[belongs_to],
            ...commentDatum
          };
        }
      );
      // console.log('inserting comment data...');
      return knex('comments')
        .insert(commentsToInsert)
        .returning('*');
    });
};
