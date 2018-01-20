const express = require('express')
const router = express.Router()

const jwt = require('jsonwebtoken');

const auth = require('../util/auth');
const config = require('../config');
const knex = require('../db');
const twilio = require('../twilio');

router.get('/', (req, res) => {
  knex.table('Challenges').then(data => {
    res.json(data);
  }, (err) => {
    res.json(err)
  });
})

router.post('/:id/join', auth.privated, (req, res) => {
  const id = req.params.id;
  const user = req.user;

  knex.table('ChallengesAcceptant').insert({
    challenge_id: id,
    user_id: user.id,
    status: 1
  }).then(data => {
    res.json(data);
  }, (err) => {
    res.json(err)
  });
});

router.get('/:id/member', auth.privated, (req, res) => {
  const id = req.params.id;
  const user = req.user;

  knex.table('Challenges')
    .select({
      id: 'Users.id',
      phone: 'Users.phone',
      fullname: 'Users.fullname'
    })
    .where({ 'Challenges.id': id })
    .join('ChallengesAcceptant', 'Challenges.id', 'ChallengesAcceptant.challenge_id')
    .join('Users', 'ChallengesAcceptant.user_id', 'Users.id')
    .then(data => res.json(data), (err) => res.json(err));
});

router.post('/:id/status', auth.privated, (req, res) => {
  const id = req.params.id;
  const user = req.user;

  knex.table('ChallengesAcceptant')
    .where({
      user_id: user.id,
      challenge_id: id,
    })
    .update({
      status: body.status
    })
    .then(data => res.json(data), (err) => res.json(err));
});

router.post('/:id/confirm', auth.privated, (req, res) => {
  const id = req.params.id;
  const user = req.user;

  res.json(req.body);

  // knex.table('ChallengesAcceptant')
  //   .where({
  //     user_id: user.id,
  //     challenge_id: id,
  //   })
  //   .update({
  //     status: body.status
  //   })
  //   .then(data => res.json(data), (err) => res.json(err));
})

router.post('/:id/invite', auth.privated, (req, res) => {
  const id = req.params.id;
  const user = req.user;

  twilio.messages.create({
      body: 'Hello from Node',
      to: config.twilioPhone,  // Text this number
      from: '+12345678901' // From a valid Twilio number
  })
  .then((message) => console.log(message.sid))

})

module.exports = router;
