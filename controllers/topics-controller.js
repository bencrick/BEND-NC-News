const { selectTopics } = require('../models/topics-models');

function getTopics(req, res, next) {
  selectTopics(req).then(topics => {
    res.status(200).json({ topics });
  });
}

module.exports = { getTopics };