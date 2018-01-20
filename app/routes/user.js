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
			if (data && data.length && data.length === 0) {
				res.json({
					messages: 'Wrong phone number or password'
				})
			} else {
				const user = data[0];
				console.log(user);
				if (user.password !== body.password) {
					res.json({
						messages: 'Wrong phone number or password'
					})
				} else {
					const token = jwt.sign(
						{
							id: 1,
							fullname: 'Lê Minh Thành',
							phone: '0938102160',
						},
						config.secret
					);
					res.json({ token });
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
	knex.table('users')
		.where({ id: user.id })
		.then(data => res.json(data[0]), (err) => res.json(err));
})

router.get('/myChallenges', auth.privated, (req, res) => {
	const user = req.user;
	knex.table('challengeacceptant').where({sdt: user.sdt }).then(
		(data) => {
			res.json(data[0]);
		},
		(err) => {
			res.json(err);
		}
	);
});

router.post('/register', (req, res) => {
	knex('users').insert(req.body).then(
		(data) => {
			res.json(data);
		},
		(err) => {
			res.json(err);
		}
	);
});

router.post('/join', (req, res) => {
	knex('challengeacceptant').insert(req.body).then(
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
