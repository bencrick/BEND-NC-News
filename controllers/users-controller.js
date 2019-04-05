const selectUser = require('../models/users-models');

function getUser(req, res, next) {
  selectUser(req.params)
    .then(userRows => {
      if (userRows.length === 0) {
        next({ code: 404 });
      } else {
        const user = userRows[0];
        res.status(200).json({ user });
      }
    })
    .catch(next);
}

module.exports = { getUser };
