const apiRouter = require('express').Router();
//const { methodNotAllowed } = require('../errors');
const topicsRouter = require('./topics-router')
const articlesRouter = require('./articles-router');

apiRouter.route('/').get((req, res) => res.status(200).json({ ok: true }));
//.all(methodNotAllowed);

apiRouter.use('/topics', topicsRouter);

apiRouter.use('/articles', articlesRouter);

module.exports = apiRouter;
