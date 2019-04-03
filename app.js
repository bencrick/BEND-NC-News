const express = require('express');
const apiRouter = require('./routes/api-router');
const bodyParser = require('body-parser');
const {
  badRequest,
  routeNotFound,
  methodNotAllowed,
  unprocessableEntity,
  handle500
} = require('./errors');

//const { routeNotFound, handle500 } = require('./errors');

const app = express();

app.use(express.json());

app.use(bodyParser.json());

app.use('/api', apiRouter);

app.all('/*', routeNotFound);

app.use((err, req, res, next) => {
  if (err.code === '22P02') {
    badRequest(req, res);
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === 404) {
    routeNotFound(req, res);
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err.code, '<--- error code');
  if (err.code === 422) {
    unprocessableEntity(req, res);
  } else {
    next(err);
  }
});

app.use(handle500);

module.exports = app;
