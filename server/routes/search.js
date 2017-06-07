'use strict';
const express = require('express');
const router = express.Router();

router.route('/query')
  .get((req, res) => {
    res.status(200).send('Hello World!');
  })

module.exports = router;