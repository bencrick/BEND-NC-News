const connection = require('../db/connection');
const {
  objRenameKey,
  selectTableColValues,
  noRowsThrow404
} = require('../utils');

function selectAllArticles(queryObj) {
  const sortObj = { sort_by: 'created_at', order: 'desc' };
  ['sort_by', 'order'].forEach(sortProp => {
    if (queryObj.hasOwnProperty(sortProp)) {
      sortObj[sortProp] = queryObj[sortProp];
      delete queryObj[sortProp];
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
    if (queryObj.hasOwnProperty(field)) {
      queryObj[`articles.${field}`] = queryObj[field];
      delete queryObj[field];
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
    .where(queryObj)
    .groupBy('articles.article_id')
    .orderBy(sortObj.sort_by, sortObj.order);
}

function selectArticle(params) {
  const articleFields = [
    'author',
    'title',
    'article_id',
    'body',
    'topic',
    'created_at',
    'votes'
  ];
  const useParams = {};
  articleFields.forEach(field => {
    if (params.hasOwnProperty(field)) {
      useParams[`articles.${field}`] = params[field];
    }
  });
  return connection
    .select(...articleFields.map(field => `articles.${field}`))
    .count('comments.comment_id AS comment_count')
    .from('articles')
    .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
    .where(useParams)
    .groupBy('articles.article_id');
}

function modifyArticle(params, updateObj) {
  const incrementObj = {};
  for (prop in updateObj) {
    if (/^inc_/.test(prop)) {
      incrementObj[prop.replace(/^inc_/, '')] = updateObj[prop];
      delete updateObj[prop];
    }
  }
  const connectionPromise = connection('articles')
    .where(params)
    .returning('*');

  if (Object.keys(incrementObj).length > 0) {
    connectionPromise.increment(incrementObj);
  }
  if (Object.keys(updateObj).length > 0) {
    connectionPromise.update(updateObj);
  }

  return connectionPromise;
}

function removeArticle(params) {
  return connection('articles')
    .where(params)
    .del();
}

function selectArticleComments(params, query) {
  const sortObj = { sort_by: 'created_at', order: 'desc' };
  ['sort_by', 'order'].forEach(sortProp => {
    if (query.hasOwnProperty(sortProp)) {
      sortObj[sortProp] = query[sortProp];
    }
  });
  const commentFields = [
    'comment_id',
    'votes',
    'created_at',
    'author',
    'body',
    'article_id'
  ];
  const useParams = {};
  commentFields.forEach(field => {
    if (params.hasOwnProperty(field)) {
      useParams[`comments.${field}`] = params[field];
    }
    if (sortObj.sortProp === field) {
      sortObj.sortProp === `comments.${field}`;
    }
  });
  return connection
    .select(...commentFields.slice(0, -1).map(field => `comments.${field}`))
    .from('articles')
    .innerJoin('comments', 'articles.article_id', '=', 'comments.article_id')
    .where(useParams)
    .orderBy(sortObj.sort_by, sortObj.order);
}

function addArticleComment(params, commentReqBody) {
  const comment = {
    author: commentReqBody.username,
    body: commentReqBody.body,
    article_id: params.article_id
  };
  return connection
    .insert(comment)
    .into('comments')
    .returning('*');
}

function addArticle(params, articleReqBody) {
  const article = {
    title: articleReqBody.title,
    body: articleReqBody.body,
    topic: articleReqBody.topic,
    author: articleReqBody.author
  };
  return connection
    .insert(article)
    .into('articles')
    .returning('*');
}

module.exports = {
  selectArticle,
  modifyArticle,
  removeArticle,
  selectArticleComments,
  addArticleComment,
  selectAllArticles,
  addArticle
};
