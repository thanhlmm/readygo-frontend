const express = require('express')
const router = express.Router()

const jwt = require('jsonwebtoken');

const auth = require('../util/auth');
const config = require('../config');
const knex = require('../db');

router.get('/', (req, res) => {
  knex.table('Challenges').then(data => {
    res.json(data);
  }, (err) => {
    res.status(442).json(err)
  });
})

router.post('/:id/join', auth.privated, (req, res) => {
  const id = req.params.id;
  const user = req.user;

  knex.table('ChallengeAcceptant').insert({
    challenge_id: id,
    sdt: user.sdt,
    status: 1
  }).then(data => {
    res.json(data);
  }, (err) => {
    res.status(442).json(err)
  });
});

module.exports = router;
