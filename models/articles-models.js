const connection = require('../db/connection');
const {
  objRenameKey,
  selectTableColValues,
  noRowsThrow404
} = require('../utils');

async function selectArticles(req) {
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

  if (Object.keys(req.params).length > 0) {
    await noRowsThrow404(connection, 'articles', whereObj);
  }

  const articleFields = [
    'author',
    'title',
    'article_id',
    'body',
    'topic',
    'created_at',
    'votes'
  ];

  for (prop in req.query) {
    if (!['sort_by', 'order', ...articleFields].includes(prop)) {
      throw { code: 400 };
    }
  }

  articleFields.forEach(field => {
    if (whereObj.hasOwnProperty(field)) {
      whereObj = objRenameKey(whereObj, field, `articles.${field}`);
    }
    if (sortObj.sortProp === field) {
      sortObj.sortProp === `articles.${field}`;
    }
  });

  return connection
    .select(...articleFields.map(field => `articles.${field}`))
    .count('comments.comment_id AS comment_count')
    .from('articles')
    .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
    .where(whereObj)
    .groupBy('articles.article_id')
    .orderBy(sortObj.sort_by, sortObj.order);
}

async function modifyArticles(req) {
  const whereObj = {};
  Object.assign(whereObj, req.query);
  Object.assign(whereObj, req.params);
  const updateObj = req.body;

  await noRowsThrow404(connection, 'articles', whereObj);

  for (prop in updateObj) {
    if (/^inc_/.test(prop)) {
      const updateProp = prop.replace(/^inc_/, '');
      const currentRows = await selectTableColValues(
        connection,
        'articles',
        updateProp,
        whereObj
      );
      const updateValue = currentRows[0][updateProp];
      updateObj[updateProp] = updateObj[prop] + updateValue;
      delete updateObj[prop];
    }
  }
  return connection('articles')
    .where(whereObj)
    .update(updateObj)
    .returning('*');
}

async function removeArticles(req) {
  const whereObj = {};
  Object.assign(whereObj, req.query);
  Object.assign(whereObj, req.params);

  await noRowsThrow404(connection, 'articles', whereObj);

  return connection('articles')
    .where(whereObj)
    .del();
}

async function selectArticleComments(req) {
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

  await noRowsThrow404(connection, 'articles', whereObj);

  const commentFields = [
    'comment_id',
    'votes',
    'created_at',
    'author',
    'body',
    'article_id'
  ];

  for (prop in req.query) {
    if (!commentFields.includes(prop)) {
      throw { code: 400 };
    }
  }

  commentFields.forEach(field => {
    if (whereObj.hasOwnProperty(field)) {
      whereObj = objRenameKey(whereObj, field, `comments.${field}`);
    }
    if (sortObj.sortProp === field) {
      sortObj.sortProp === `comments.${field}`;
    }
  });

  return connection
    .select(...commentFields.slice(0, -1).map(field => `comments.${field}`))
    .from('articles')
    .innerJoin('comments', 'articles.article_id', '=', 'comments.article_id')
    .where(whereObj)
    .orderBy(sortObj.sort_by, sortObj.order);
}

function addArticleComment(req) {
  const comment = objRenameKey(req.body, 'username', 'author');
  comment.article_id = req.params.article_id;
  return connection
    .insert(comment)
    .into('comments')
    .returning('*');
}

module.exports = {
  selectArticles,
  modifyArticles,
  removeArticles,
  selectArticleComments,
  addArticleComment
};
