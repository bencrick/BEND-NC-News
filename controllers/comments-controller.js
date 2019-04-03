const { modifyComments, removeComments } = require('../models/comments-models');

function patchComment(req, res, next) {
  modifyComments(req).then(comments => {
    res.status(202).json({ comments });
  });
}

function deleteComment(req, res, next) {
  removeComments(req).then(comments => {
    res.status(204).json({ comments });
  });
}

module.exports = { patchComment, deleteComment };
