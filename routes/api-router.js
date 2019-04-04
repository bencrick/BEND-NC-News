const apiRouter = require('express').Router();
const { methodNotAllowed } = require('../errors');
const topicsRouter = require('./topics-router');
const articlesRouter = require('./articles-router');
const commentsRouter = require('./comments-router');
const usersRouter = require('./users-router');

apiRouter
  .route('/')
  .get((req, res) => res.status(200).json({
      'topics': '/api/topics',
      'articles': '/api/articles',
      'article': '/api/articles/:article_id',
      'article-comments': '/api/articles/:article_id/comments',
      'comment': '/api/comments/:comment_id',
      'user': '/api/users/:username'
    }))
  .all(methodNotAllowed);

apiRouter.use('/topics', topicsRouter);

apiRouter.use('/articles', articlesRouter);

apiRouter.use('/comments', commentsRouter);

apiRouter.use('/users', usersRouter);

module.exports = apiRouter;
