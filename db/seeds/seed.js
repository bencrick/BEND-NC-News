const { articles, comments, topics, users } = require('../data');
const createRefObj = require('../../utils/createRefObj');

exports.seed = (knex, Promise) => {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      return knex('topics')
        .insert(topics)
        .returning('*');
    })
    .then(topicRows => {
      console.log(topicRows, '<----- topicRows');
      return knex('users')
        .insert(users)
        .returning('*');
    })
    .then(userRows => {
      console.log(userRows, '<----- userRows');
      return knex('articles')
        .insert(articles)
        .returning('*');
    })
    .then(articleRows => {
      console.log(articleRows, '<----- articleRows');
      const articleTitleToId = createRefObj(articleRows, title, article_id);
      const insertComments = comments.map(comment => {
        let newComment = objRenameKey(comment, 'created_by', 'author');
        newComment.article_id = articleTitleToId[comment.belongs_to];
        delete newComment.belongs_to;
        return newComment;
      });
      return knex('comments')
        .insert(insertComments)
        .returning('*');
    })
    .then(commentRows => {
      console.log(commentRows, '<----- commentRows');
    });
};
