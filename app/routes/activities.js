const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');

const auth = require('../util/auth')
const config = require('../config');
const knex = require('../db');

router.get('/', auth.privated, (req, res) => {
  const user = req.user;
  knex.raw('select `challenges`.*, (SELECT COUNT(id) from challengesacceptant where challengesacceptant.challenge_id = challenges.id) as `total_member`, (SELECT COUNT(id) from challengesacceptant where challengesacceptant.challenge_id = challenges.id AND challengesacceptant.user_id = '+ user.id +') as `is_joined`  from `challenges` where `challenges`.`status` = 1 OR `challenges`.`status` = 2 order by `total_member` DESC')
    .then(data => {
      res.json(data[0]);
    }, (err) => {
      res.status(442).json(err)
    });

});

module.exports = router;
