const knex = require('./db')
const config = require('./config')

console.log(
    knex.table('invitations')
    .select(knex.raw('challenges.*'))
    .join('challenges', 'challenges.id', 'invitations.challenge_id')
    .where({ phone: '01293' }).toString())