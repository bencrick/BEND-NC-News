const commentsRouter = require('express').Router();
//const { methodNotAllowed } = require('../errors');
const {
  patchComment,
  deleteComment
} = require('../controllers/comments-controller');

commentsRouter
  .route('/:comment_id')
  .patch(patchComment)
  .delete(deleteComment);

module.exports = commentsRouter;
