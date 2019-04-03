const articlesRouter = require('express').Router();
//const { methodNotAllowed } = require('../errors');
const {
  getArticles,
  patchArticle,
  deleteArticle,
  getArticleComments,
  postArticleComment
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
  .get(getArticleComments)
  .post(postArticleComment)

module.exports = articlesRouter;
