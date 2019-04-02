function selectArticles(req) {
  const optionObj = {
    sort_by: 'created_at',
    order: 'desc'
  };

  if (req.query) {
    Object.assign(optionObj, req.query);
  }
  if (req.params) {
    Object.assign(optionObj, req.params);
  }

  const sortObj = {
    sort_by: optionObj.sort_by,
    order: optionObj.order
  };

  const whereObj = { ...optionObj };
  delete whereObj.sort_by;
  delete whereObj.order;

  return connection
    .select(
      'articles.author',
      'articles.title',
      'articles.topic',
      'articles.created_at',
      'articles.votes'
    )
    .count('comments.comment_id')
    .from('articles')
    .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
    .where(whereObj)
    .groupBy('articles.article_id')
    .orderBy(sortObj.sort_by, sortObj.order);
}

module.exports = { selectArticles };
