const { modifyComments, removeComments } = require('../models/comments-models');

function patchComment(req, res, next) {
  modifyComments(req.params, req.body)
    .then(comments => {
      if (comments.length === 0) {
        next({ code: 404 });
      } else {
        res.status(202).json({ comments });
      }
    })
    .catch(next);
}

function deleteComment(req, res, next) {
  removeComments(req.params)
    .then(deletions => {
      if (deletions === 0) {
        next({ code: 404 });
      } else {
        res.status(204).json({});
      }
    })
    .catch(next);
}

module.exports = { patchComment, deleteComment };
