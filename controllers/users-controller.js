const selectUsers = require('../models/users-models');

function getUsers(req, res, next) {
  selectUsers(req).then(users => {
    const user = users[0];
    res.status(200).json({ user });
  });
}

module.exports = { getUsers };
