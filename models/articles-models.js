const connection = require('../db/connection');

function selectArticles(req) {
  const whereObj = {};
  for (whereProp in ['query', 'params']) {
    if (req[whereProp]) {
      Object.assign(whereObj, req[whereProp]);
    }
  }

  const sortObj = { sort_by: 'created_at', order: 'desc' };
  for (sortProp in ['sort_by', 'order']) {
    if (req.query[sortProp]) {
      sortObj[sortProp] = req.query[sortProp];
      delete whereObj[sortProp];
    }
  }

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

module.exports = { selectArticles };
