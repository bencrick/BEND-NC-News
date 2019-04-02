const { selectArticles } = require('../models/articles-models')

function getArticles(req, res, next) {
  selectArticles(req).then(articles => {
    res.status(200).json(articles);
  });
}

module.exports = { getArticles };
