const knex = require('./db')
const config = require('./config')

console.log(
knex.table('challenges')
    .update({ status: config.FAIL })
    .where('start_time', '<', new Date())
    .andWhere({ status: config.NEW }).toString())