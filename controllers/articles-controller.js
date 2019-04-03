const { selectArticles, modifyArticles } = require('../models/articles-models');

function getArticles(req, res, next) {
  selectArticles(req).then(articles => {
    res.status(200).json({ articles });
  });
}

function patchArticle(req, res, next) {
  modifyArticles(req).then(articles => {
    res.status(202).json({ articles });
  });
}

function getArticleComments(req, res, next) {
  selectArticleComments(req).then(comments => {
    res.status(200).json({ comments });
  });
}

module.exports = { getArticles, patchArticle, getArticleComments };
