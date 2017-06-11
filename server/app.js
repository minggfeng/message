'use strict';
const express = require('express');
const middleware = require('./middleware');
const routes = require('./routes');
const knex = require('knex')(require('../knexfile'));
const redisClient = require('../redis/redis.js');

const app = express();

app.use(middleware.morgan('dev'));
app.use(middleware.bodyParser.urlencoded({ extended: false }));
app.use(middleware.bodyParser.json());

module.exports = app;
