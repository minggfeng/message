'use strict';

const express = require('express');
const router = express.Router();

router.route('/indices')
  .get((req, res) => {
    res.status(200).send('Hello World!');
  })

module.exports = router;