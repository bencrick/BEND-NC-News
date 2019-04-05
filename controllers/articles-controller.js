const {
  selectArticle,
  modifyArticle,
  removeArticle,
  selectArticleComments,
  addArticleComment,
  selectAllArticles
} = require('../models/articles-models');

function getAllArticles(req, res, next) {
  const acceptedQueries = [
    'sort_by',
    'order',
    'author',
    'title',
    'article_id',
    'body',
    'topic',
    'created_at',
    'votes'
  ];
  let badRequest = false;
  for (prop in req.query) {
    if (!acceptedQueries.includes(prop)) {
      badRequest = true;
      break;
    }
  }
  if (badRequest) {
    next({ code: 400 });
  } else {
    selectAllArticles(req.query).then(articles => {
      res.status(200).json({ articles });
    });
  }
}

function getArticle(req, res, next) {
  const acceptedQueries = [
    'sort_by',
    'order',
    'author',
    'title',
    'article_id',
    'body',
    'topic',
    'created_at',
    'votes'
  ];
  let badRequest = false;
  for (prop in req.query) {
    if (!acceptedQueries.includes(prop)) {
      badRequest = true;
      break;
    }
  }
  if (badRequest) {
    next({ code: 404 });
  } else {
    selectArticle(req.params)
      .then(articles => {
        if (articles.length === 0) {
          next({ code: 404 });
        } else {
          const article = articles[0];
          res.status(200).json({ article });
        }
      })
      .catch(next);
  }
}

function patchArticle(req, res, next) {
  modifyArticle(req.params, req.body)
    .then(articles => {
      if (articles.length === 0) {
        next({ code: 404 });
      } else {
        const article = articles[0];
        res.status(202).json({ article });
      }
    })
    .catch(next);
}

function deleteArticle(req, res, next) {
  removeArticle(req.params)
    .then(deletions => {
      if (deletions === 0) {
        next({ code: 404 });
      } else {
        res.status(204).json({});
      }
    })
    .catch(next);
}

function getArticleComments(req, res, next) {
  const acceptedQueries = ['sort_by', 'order'];
  let badRequest = false;
  for (prop in req.query) {
    if (!acceptedQueries.includes(prop)) {
      badRequest = true;
      break;
    }
  }
  if (badRequest) {
    next({ code: 400 });
  } else {
    selectArticleComments(req.params, req.query)
      .then(comments => {
        if (comments.length === 0) {
          next({ code: 404 });
        } else {
          res.status(200).json({ comments });
        }
      })
      .catch(next);
  }
}

function postArticleComment(req, res, next) {
  addArticleComment(req.params, req.body)
    .then(comments => {
      const comment = comments[0];
      res.status(201).json({ comment });
    })
    .catch(next);
}

module.exports = {
  getArticle,
  patchArticle,
  getArticleComments,
  deleteArticle,
  getArticleComments,
  postArticleComment,
  getAllArticles
};
