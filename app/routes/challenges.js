const express = require('express')
const router = express.Router()

const jwt = require('jsonwebtoken');

const auth = require('../util/auth');
const config = require('../config');
const knex = require('../db');
const nexmo = require('../nexmo');

router.get('/', (req, res) => {
  Promise.all([
    knex.table('rewards'),
    knex.table('challenges').orderBy('id', 'DESC')
  ]).then(data => {
    console.log(data)
    const rewards = data[0];
    const challenges = data[1];
    challenges.forEach(challenge => {
      challenge.rewards = rewards.filter(reward => reward.challenge_id === challenge.id)
    });

    return challenges;
  }).then(data => {
    res.json(data);
  }, (err) => {
    res.json(err)
  });
})

router.post('/', (req, res) => {
  knex.table('challenges').insert(req.body).then(data => {
    res.json(data);
  }, (err) => {
    res.json(err)
  });
})

router.post('/:id/join', auth.privated, (req, res) => {
  const id = req.params.id;
  const user = req.user;

  knex.table('challengesacceptant').insert({
    challenge_id: id,
    user_id: user.id,
    status: 1,
    date: new Date(),
  }).then(data => {
    res.json(data);
  }, (err) => {
    res.json(err)
  });
});

router.get('/:id/member', auth.privated, (req, res) => {
  const id = req.params.id;
  const user = req.user;

  knex.table('challenges')
    .select({
      id: 'users.id',
      phone: 'users.phone',
      fullname: 'users.fullname'
    })
    .where({ 'challenges.id': id })
    .join('challengesacceptant', 'challenges.id', 'challengesacceptant.challenge_id')
    .join('users', 'challengesacceptant.user_id', 'users.id')
    .then(data => res.json(data), (err) => res.json(err));
});

router.get('/:id/rewards', auth.privated, (req, res) => {
  const id = req.params.id;
  const user = req.user;

  knex.table('rewards')
    .where({ 'challenge_id': id })
    .then(data => res.json(data), (err) => res.json(err));
});

router.post('/:id/rewards', auth.privated, (req, res) => {
  const id = req.params.id;
  const user = req.user;

  const newReward = req.body;
  newReward.challenge_id = id;
  knex.table('rewards')
    .insert(newReward)
    .then(data => res.json(data), (err) => res.json(err));
});


router.post('/:id/status', auth.privated, (req, res) => {
  const id = req.params.id;
  const user = req.user;

  knex.table('challengesacceptant')
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

  // knex.table('challengesacceptant')
  //   .where({
  //     user_id: user.id,
  //     challenge_id: id,
  //   })
  //   .update({
  //     status: body.status
  //   })
  //   .then(data => res.json(data), (err) => res.json(err));
})

router.get('/:id/activities', auth.privated, (req, res) => {
  const id = req.params.id;
  knex.table('challengesacceptant')
    .where({challenge_id: id})
    .then(data => res.json(data), (err) => res.json(err));
})

router.post('/:id/invite', auth.privated, (req, res) => {
  const id = req.params.id;
  const user = req.user;

  nexmo.message.sendSms('NEXMO', req.body.phone, 'Hello', {}, (err, data) => {
    console.log(err);
    console.log(data);
    res.json({ ok: 'ok' })
  })

})

module.exports = router;
