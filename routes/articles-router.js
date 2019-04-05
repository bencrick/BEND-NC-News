const articlesRouter = require('express').Router();
const { methodNotAllowed } = require('../errors');
const {
  getArticle,
  patchArticle,
  deleteArticle,
  getArticleComments,
  postArticleComment,
  getAllArticles
} = require('../controllers/articles-controller');

articlesRouter
  .route('/')
  .get(getAllArticles)
  .all(methodNotAllowed);

articlesRouter
  .route('/:article_id')
  .get(getArticle)
  .patch(patchArticle)
  .delete(deleteArticle)
  .all(methodNotAllowed);

articlesRouter
  .route('/:article_id/comments')
  .get(getArticleComments)
  .post(postArticleComment)
  .all(methodNotAllowed);

module.exports = articlesRouter;
