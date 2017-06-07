'use strict';
const express = require('express');
const middleware = require('./middleware');
const routes = require('./routes');

const app = express();

app.use(middleware.morgan('dev'));
app.use(middleware.bodyParser.urlencoded({ extended: false }));
app.use(middleware.bodyParser.json());

app.get('/', (req, res) => {
  res.status(200).send('Hello World');
})

module.exports = app;