const apiRouter = require('express').Router();
const { methodNotAllowed } = require('../errors');
const articlesRouter = require('./articles-router')

apiRouter
  .route('/')

apiRouter.use('/articles', articlesRouter)

apiRouter
  .get((req, res) => res.send({ ok: true }))
  .all(methodNotAllowed);

module.exports = apiRouter;
