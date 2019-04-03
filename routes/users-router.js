const usersRouter = require('express').Router();
const { methodNotAllowed } = require('../errors');
const { getUsers } = require('../controllers/users-controller');

usersRouter
  .route('/:username')
  .get(getUsers)
  .all(methodNotAllowed);

module.exports = usersRouter;
