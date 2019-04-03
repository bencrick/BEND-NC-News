const {
  selectArticles,
  modifyArticles,
  removeArticles,
  selectArticleComments,
  addArticleComment
} = require('../models/articles-models');

function getArticles(req, res, next) {
  selectArticles(req)
    .then(articles => {
      res.status(200).json({ articles });
    })
    .catch(next);
}

function patchArticle(req, res, next) {
  modifyArticles(req)
    .then(articles => {
      res.status(202).json({ articles });
    })
    .catch(next);
}

function deleteArticle(req, res, next) {
  removeArticles(req)
    .then(articles => {
      res.status(204).json({ articles });
    })
    .catch(next);
}

function getArticleComments(req, res, next) {
  selectArticleComments(req)
    .then(comments => {
      res.status(200).json({ comments });
    })
    .catch(next);
}

function postArticleComment(req, res, next) {
  addArticleComment(req)
    .then(comments => {
      const comment = comments[0];
      res.status(201).json({ comment });
    })
    .catch(next);
}

module.exports = {
  getArticles,
  patchArticle,
  getArticleComments,
  deleteArticle,
  getArticleComments,
  postArticleComment
};
