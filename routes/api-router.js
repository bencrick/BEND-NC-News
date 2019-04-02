const apiRouter = require('express').Router();
//const { methodNotAllowed } = require('../errors');
const articlesRouter = require('./articles-router')

apiRouter
  .route('/')
  .get((req, res) => res.status(200).json({ ok: true }))
  //.all(methodNotAllowed);

apiRouter.use('/articles', articlesRouter)

module.exports = apiRouter;
