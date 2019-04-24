const express = require('express');
const apiRouter = require('./routes/api-router');
const bodyParser = require('body-parser');
const cors = require('cors');
const {
  badRequest,
  routeNotFound,
  methodNotAllowed,
  unprocessableEntity,
  handle500
} = require('./errors');

//const { routeNotFound, handle500 } = require('./errors');

const app = express();

app.use(cors());

app.use(express.json());

app.use(bodyParser.json());

app.use('/api', apiRouter);

app.all('/*', routeNotFound);

app.use((err, req, res, next) => {
  const codes = ['22P02', '400'];
  if (codes.includes(String(err.code))) {
    badRequest(req, res);
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  const codes = ['404', '23503'];
  if (codes.includes(String(err.code))) {
    routeNotFound(req, res);
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  const codes = [];
  if (codes.includes(String(err.code))) {
    unprocessableEntity(req, res);
  } else {
    next(err);
  }
});

app.use(handle500);

module.exports = app;
