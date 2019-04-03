const articlesRouter = require('express').Router();
//const { methodNotAllowed } = require('../errors');
const {
  getArticles,
  patchArticle,
  deleteArticle,
  getArticleComments
} = require('../controllers/articles-controller');

articlesRouter.route('/').get(getArticles);
//.all(methodNotAllowed);

articlesRouter
  .route('/:article_id')
  .get(getArticles)
  .patch(patchArticle)
  .delete(deleteArticle);

articlesRouter
  .route('/:article_id/comments')
  .get(getArticleComments);

module.exports = articlesRouter;
