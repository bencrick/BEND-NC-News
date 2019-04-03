const connection = require('../db/connection');
const { objRenameKey } = require('../utils');

function selectArticles(req) {
  let whereObj = {};
  Object.assign(whereObj, req.query);
  Object.assign(whereObj, req.params);

  let sortObj = { sort_by: 'created_at', order: 'desc' };
  ['sort_by', 'order'].forEach(sortProp => {
    if (req.query.hasOwnProperty(sortProp)) {
      sortObj[sortProp] = req.query[sortProp];
      delete whereObj[sortProp];
    }
  });

  const articleFields = [
    'author',
    'title',
    'article_id',
    'body',
    'topic',
    'created_at',
    'votes'
  ];

  articleFields.forEach(field => {
    if (whereObj.hasOwnProperty(field)) {
      whereObj = objRenameKey(whereObj, field, `articles.${field}`);
    }
    if (sortObj.sortProp === field) {
      sortObj.sortProp === `articles.${field}`;
    }
  });

  return connection
    .select(
      'articles.author',
      'articles.title',
      'articles.article_id',
      'articles.body',
      'articles.topic',
      'articles.created_at',
      'articles.votes'
    )
    .count('comments.comment_id AS comment_count')
    .from('articles')
    .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
    .where(whereObj)
    .groupBy('articles.article_id')
    .orderBy(sortObj.sort_by, sortObj.order);
}

function selectTableColValue(table, column, whereObj) {
  return connection
    .select(column)
    .from(table)
    .where(whereObj);
}

async function modifyArticles(req) {
  const whereObj = {};
  Object.assign(whereObj, req.query);
  Object.assign(whereObj, req.params);
  const updateObj = req.body;

  for (prop in updateObj) {
    if (/^inc_/.test(prop)) {
      const updateProp = prop.replace(/^inc_/, '');
      const currentRows = await selectTableColValue(
        'articles',
        updateProp,
        whereObj
      );
      const updateValue = currentRows[0][updateProp]
      updateObj[updateProp] = updateObj[prop] + updateValue;
      delete updateObj[prop];
    }
  }
  return connection('articles')
    .where(whereObj)
    .update(updateObj)
    .returning('*');
}

function selectArticleComments(req) {
  let whereObj = {};
  Object.assign(whereObj, req.query);
  Object.assign(whereObj, req.params);

  let sortObj = { sort_by: 'created_at', order: 'desc' };
  ['sort_by', 'order'].forEach(sortProp => {
    if (req.query.hasOwnProperty(sortProp)) {
      sortObj[sortProp] = req.query[sortProp];
      delete whereObj[sortProp];
    }
  });

  const articleFields = [
    'author',
    'title',
    'article_id',
    'body',
    'topic',
    'created_at',
    'votes'
  ];

  articleFields.forEach(field => {
    if (whereObj.hasOwnProperty(field)) {
      whereObj = objRenameKey(whereObj, field, `articles.${field}`);
    }
    if (sortObj.sortProp === field) {
      sortObj.sortProp === `articles.${field}`;
    }
  });

  return connection
    .select(
      'articles.author',
      'articles.title',
      'articles.article_id',
      'articles.body',
      'articles.topic',
      'articles.created_at',
      'articles.votes'
    )
    .count('comments.comment_id AS comment_count')
    .from('articles')
    .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
    .where(whereObj)
    .groupBy('articles.article_id')
    .orderBy(sortObj.sort_by, sortObj.order);
}

module.exports = { selectArticles, modifyArticles, selectArticleComments };
