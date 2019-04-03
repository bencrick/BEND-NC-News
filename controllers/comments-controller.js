const { modifyComments, removeComments } = require('../models/comments-models');

function patchComment(req, res, next) {
  modifyComments(req)
    .then(comments => {
      if (comments.length === 0) {
        throw { code: 404 }
      }
      res.status(202).json({ comments });
    })
    .catch(next);
}

function deleteComment(req, res, next) {
  removeComments(req)
    .then(comments => {
      res.status(204).json({ comments });
    })
    .catch(next);
}

module.exports = { patchComment, deleteComment };
