const CronJob = require('cron').CronJob;
const knex = require('../db');
const config = require('../config');
const notif = require('../notif');

module.exports = new CronJob('*/1 * * * *', function() {
  
  console.log('Run every 5 min');
  // Change status from NEW to READY if we got enough member
  knex.table('challenges')
    .select(knex.raw('challenges.*, (SELECT COUNT(id) from challengesacceptant where challengesacceptant.challenge_id = challenges.id) as total_member'))
    .where({ status: config.NEW })
    .then(challenges => {
      challenges.forEach(challenge => {
        if (challenge.total_member === challenge.require_user) {
          // READY
          knex.table('challenges')
            .where({ id: challenge.id })
            .update({ status: config.READY })
            .then(data => console.log(data))
          knex.table('challengesacceptant')
            .select('oneSignal')
            .join('users', 'users.id', 'challengesacceptant.user_id')
            .where({ challenge_id: challenge.id})
            .then(users => {
              console.log(users);
              const IDs = users.filter(user => user.oneSignal.length > 0).map(user => user.oneSignal)
              console.log(IDs);
              if (IDs.length > 0) {
                notif.createNotification({
                  contents: {
                    contents: `Challenge ${challenge.name} is ready. Repair for this!`
                  },
                  specific: {
                    include_player_ids: IDs
                  },
                })
              }
            })
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
      console.log(challenges)
      // Todo: Send notification that challenge fail
      challenges.forEach(challenge => {
        knex.table('challengesacceptant')
        .select('oneSignal')
        .join('users', 'users.id', 'challengesacceptant.user_id')
        .where({ challenge_id: challenge.id})
        .then(users => {
          console.log(users);
          const IDs = users.filter(user => user.oneSignal.length > 0).map(user => user.oneSignal)
          console.log(IDs);
          if (IDs.length > 0) {
            notif.createNotification({
              contents: {
                contents: `Challenge ${challenge.name} is cancelled due to lack of quantity member`
              },
              specific: {
                include_player_ids: IDs
              },
            })
          }
        })
      })
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
          Promise.all([
            knex.table('challenges')
              .where({ id: challenge.id })
              .update({ status: config.SUCCESS }),
            knex.table('users')
              .update(knex.raw('point = point + ' + challenge.point ))
              .where(knex.raw('users.id IN (SELECT user_id FROM challengesacceptant WHERE challenge_id = '+ challenge.id +')'))
          ]).then(data => console.log(data))
          // Todo: Send notification
          challenges.forEach(challenge => {
            knex.table('challengesacceptant')
            .select('oneSignal')
            .join('users', 'users.id', 'challengesacceptant.user_id')
            .where({ challenge_id: challenge.id})
            .then(users => {
              console.log(users);
              const IDs = users.filter(user => user.oneSignal.length > 0).map(user => user.oneSignal)
              console.log(IDs);
              if (IDs.length > 0) {
                notif.createNotification({
                  contents: {
                    contents: `Congratulation! Challenge ${challenge.name} is complete. Let's take reward`
                  },
                  specific: {
                    include_player_ids: IDs
                  },
                })
              }
            })
          })

        } else {
          // FAIL
          knex.table('challenges')
            .where({ id: challenge.id })
            .update({ status: config.FAIL })
            .then(data => console.log(data))
          // Todo: Send notification
          challenges.forEach(challenge => {
            knex.table('challengesacceptant')
            .select('oneSignal')
            .join('users', 'users.id', 'challengesacceptant.user_id')
            .where({ challenge_id: challenge.id})
            .then(users => {
              console.log(users);
              const IDs = users.filter(user => user.oneSignal.length > 0).map(user => user.oneSignal)
              console.log(IDs);
              if (IDs.length > 0) {
                notif.createNotification({
                  contents: {
                    contents: `Challenge ${challenge.name} is FAIL. Remember to ask others member to do it together!`
                  },
                  specific: {
                    include_player_ids: IDs
                  },
                })
              }
            })
          })
        }
      });
    }).then(data => {
      console.log(data);
    })
    .catch(err => console.log(err));

  

}, null, true, 'America/Los_Angeles');