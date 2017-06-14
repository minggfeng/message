'use strict';
const app = require('./app');
const db = require('../db');
const PORT = process.env.PORT || 6100;
const http = require('http').createServer(app);

const server = http.listen(PORT, () => {
  console.log('Example app listening on port %s!', PORT);
});

module.exports = server;

const socket = require('../socket/socket.js');