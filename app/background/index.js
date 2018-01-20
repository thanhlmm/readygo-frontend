const CronJob = require('cron').CronJob;
const knex = require('../db');
const config = require('../config');

module.exports = new CronJob('*/5 * * * *', function() {
  
  console.log('Run every 5 min');
  // Change status from NEW to READY if we got enough member
  knex.table('challenges')
    .select(knex.raw('challenges.*, (SELECT COUNT(id) from challengesacceptant where challengesacceptant.challenge_id = challenges.id) as total_member'))
    .where({ status: config.NEW })
    .then(challenges => {
      challenges.forEach(challenge => {
        if (challenge.total_member === challenge.require_user) {
          // READY
          return knex.table('challenges')
            .where({ id: challenge.id })
            .update({ status: config.READY })
        }
        return false;
      });
    }).then(data => {
      console.log(data)
      if (data) {
        // Todo: Send notification that challenge success
      }
    })
    .catch(err => console.log(err));

  
  // Change status from NEW to fail if not enough members
  knex.table('challenges')
    .update({ status: config.FAIL })
    .where('start_time', '<', new Date())
    .andWhere({ status: config.NEW })
    .then(challenges => {
      // Todo: Send notification that challenge fail
    })
    .catch(err => console.log(err));


  // When end_time passed
  knex.table('challenges')
    .select(knex.raw(`challenges.*, (SELECT COUNT(id) FROM challengesacceptant WHERE challengesacceptant.challenge_id = challenges.id AND challengesacceptant.status = ${config.COMPLETE}) as total_member`))
    .where('end_time', '<', new Date())
    .andWhere({ status: config.READY })
    .then(challenges => {
      challenges.forEach(challenge => {
        if (challenge.total_member === challenge.require_user) {
          // SUCCESS
          return Promise.all([
            knex.table('challenges')
              .where({ id: challenge.id })
              .update({ status: config.SUCCESS }),
            knex.table('users')
              .update(knex.raw('point = point + ' + challenge.point ))
              .where(knex.raw('users.id IN (SELECT user_id FROM challengesacceptant WHERE challenge_id = '+ challenge.id +')'))
          ])
          // Todo: Send notification

        } else {
          // FAIL
          return knex.table('challenges')
            .where({ id: challenge.id })
            .update({ status: config.FAIL })
        }
      });
    }).then(data => {
      console.log(data);
    })
    .catch(err => console.log(err));

  

}, null, true, 'America/Los_Angeles');