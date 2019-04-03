const selectUsers = require('../models/users-models');

function getUsers(req, res, next) {
  selectUsers(req)
    .then(users => {
      if (users.length === 0) {
        throw {code: 404}
      }
      const user = users[0];
      res.status(200).json({ user });
    })
    .catch(next);
}

module.exports = { getUsers };
