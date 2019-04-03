exports.badRequest = (req, res) => {
  res.status(400).send({ msg: 'Bad Request' });
};

exports.routeNotFound = (req, res) => {
  res.status(404).send({ msg: 'Route Not Found' });
};

exports.methodNotAllowed = (req, res) => {
  res.status(405).send({ msg: 'Method Not Allowed' });
};

exports.unprocessableEntity = (req, res) => {
  res.status(422).send({ msg: 'Unprocessable Entity' });
};

exports.handle500 = (err, req, res, next) => {
  res.status(500).send({ msg: 'Internal Server Error' });
};
