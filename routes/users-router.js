const usersRouter = require('express').Router();
//const { methodNotAllowed } = require('../errors');
const { getUsers } = require('../controllers/users-controller');


//.all(methodNotAllowed);

usersRouter.route('/:username').get(getUsers);

module.exports = usersRouter;
