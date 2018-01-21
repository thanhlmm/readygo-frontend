const express = require('express');
const router = express.Router();

const auth = require('../util/auth')
const config = require('../config');
const nexmo = require('../nexmo');
const knex = require('../db');

router.get('/', auth.privated, (req, res) => {
  const user = req.user;
  console.log(user);
  knex.table('invitations')
    .select(knex.raw('invitations.challenge_id, users.*'))
    .join('users', 'users.id', 'invitations.user_id')
    .where({ 'invitations.phone': user.phone })
    .then(data => res.json(data))
    .catch(err => res.status(442).json(err))
});

router.post('/', auth.privated, (req, res) => {
  const user = req.user;
  const newInvitation = req.body;
  newInvitation.user_id = user.id;

  // let phone = req.body.phone;
  // if (phone[0] === 0) {
  //   phone = '+84' + phone.substring(1, phone.length)
  // }
  // // Todo: add SMS send here
  // nexmo.message.sendSms('NEXMO', phone, 'You has been invited to 1 challenge. Open app to see it!', {}, (err, data) => {
  //   console.log('sms');
  //   console.log(err);
  //   console.log(data);
  //   // res.json({ ok: 'ok' })
  // })

  knex.table('invitations')
    .insert(newInvitation)
    .then(data => res.json(data))
    .catch(err => res.status(442).json(err))
})

router.get('/:id/accept', auth.privated, (req, res) => {
  const user = req.user;
  const id = req.params.id;
  knex.table('invitations')
    .where({ id })
    .then(data => {
      const invitation = data[0];
      if (invitation) {
        return knex.table('challengesacceptant').insert({
          challenge_id: invitation.challenge_id,
          user_id: user.id,
          status: 1,
          date: new Date(),
        })
      } else {
        return false;
      }
    })
    .then(data => {
      return knex.table('invitations')
        .where({ id })
        .delete()
        .then(data => res.json(data))
    })
    .catch(err => res.status(442).json(err))
});

router.get('/:id/reject', auth.privated, (req, res) => {
  const user = req.user;
  const id = req.params.id;
  knex.table('invitations')
    .where({ id })
    .delete()
    .then(data => res.json(data))
    .catch(err => res.status(442).json(err))
});

module.exports = router;
