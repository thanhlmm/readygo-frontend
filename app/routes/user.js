const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');

const auth = require('../util/auth')
const config = require('../config');
const knex = require('../db');

router.post('/login', (req, res) => {
	const body = req.body;

	knex.table('users')
		.where({
			phone: body.phone,
		})
		.then(data => {
			if (data && data.length === 0) {
				res.status(404).json({
					message: 'Not found'
				})
			} else {
				const user = data[0];
				console.log(user);
				if (user.password !== body.password) {
					res.status(442).json({
						message: 'Wrong phone number or password'
					})
				} else {
					const token = jwt.sign(user, config.secret);
					res.status(200).json({ token, message: 'Login success' });
				}
			}
		})
});

router.get('/', (req, res) => {
	knex.table('users').then(
		(data) => {
			console.log(data);
			res.json(data);
		},
		(err) => {
			res.json(err);
		}
	);
});

router.get('/me', auth.privated, (req, res) => {
	const user = req.user;
	Promise.all([
		knex.table('users')
			.where({ id: user.id }),
		knex.table('challenges')
			.select(knex.raw('rewards.*'))
			.where({
				// 'challenges.user_id': user.id,
				'challenges.status': config.SUCCESS
			})
			.join('challengesacceptant', 'challengesacceptant.challenge_id', 'challenges.id')
			.join('rewards', 'rewards.challenge_id', 'challenges.id')
	]).then(data => {
		console.log(data[1]);
		const user = data[0][0];
		const rewards = data[1]
		user.rewards = rewards || [];
		return user;
	}).then(data => res.json(data))
		.catch(err => res.json(err));
})

router.get('/myChallenges', auth.privated, (req, res) => {
	const user = req.user;
	knex.table('challengesacceptant').where({sdt: user.sdt }).then(
		(data) => {
			res.json(data[0]);
		},
		(err) => {
			res.json(err);
		}
	);
});

router.post('/register', (req, res) => {
	knex('users').insert(req.body)
		.then(data => data[0])
		.then((userId) => {
			return knex.table('users')
				.where({ id: userId })
		}).then(data => {
			const user = data[0];
			if (user) {
				const token = jwt.sign(data, config.secret);
				res.status(200).json({ token, message: 'Signup success' });
			} else {
				res.status(442).json({ message: 'Something went wrong'});
			}
		}).catch(err => res.status(442).json(err));
});

router.post('/join', (req, res) => {
	knex('challengesacceptant').insert(req.body).then(
		(data) => {
			res.json(data);
		},
		(err) => {
			res.json(err);
		}
	);
});

router.post('/updateOneSignal', auth.privated, (req, res) => {
	const user = req.user;

	knex.table('users')
		.where({ id: user.id })
		.update({ oneSignal: body.oneSignal })
})

module.exports = router;
