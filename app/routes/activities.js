const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');

const auth = require('../util/auth')
const config = require('../config');
const knex = require('../db');

router.get('/', (req, res) => {
  knex.raw('select `challenges`.*, (SELECT COUNT(id) from challengesacceptant where challengesacceptant.challenge_id = challenges.id) as `total_member` from `challenges` where `challenges`.`status` = 1 order by `total_member` DESC')
    .then(data => {
      res.json(data[0]);
    }, (err) => {
      res.json(err)
    });

});

module.exports = router;
