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
      console.log('inserting topic data...')
      return knex('topics')
        .insert(topics)
        .returning('*');
    })
    .then(topicRows => {
      console.log('inserting user data...');
      return knex('users')
        .insert(users)
        .returning('*');
    })
    .then(userRows => {
      const insertArticles = objArrMap(articles, 'created_at', makeTimestamp);
      console.log('inserting article data...');
      return knex('articles')
        .insert(insertArticles)
        .returning('*');
    })
    .then(articleRows => {
      const articleTitleToId = createRefObj(articleRows, 'title', 'article_id');
      const insertComments = objArrMap(
        comments,
        'created_at',
        makeTimestamp
      ).map(comment => {
        let newComment = objRenameKey(comment, 'created_by', 'author');
        newComment.article_id = articleTitleToId[comment.belongs_to];
        delete newComment.belongs_to;
        return newComment;
      });
      console.log('inserting comment data...');
      return knex('comments')
        .insert(insertComments)
        .returning('*');
    })
};
