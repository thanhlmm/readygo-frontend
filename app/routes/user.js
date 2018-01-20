const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');

const auth = require('../util/auth')
const config = require('../config');
const knex = require('../db');

router.get('/login', (req, res) => {

	knex.table('Users')
		.where({
			phone: body.phone,
		})
		.then(data => {
			if (data && data.length && data.length === 0) {
				res.json({
					messages: 'Wrong phone number or password'
				})
			} else {
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
	knex.table('Users').then(
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
	knex.table('Users')
		.where_=({ id: user.id })
		.then(data => res.json(data[0]), (err) => res.json(err));
})

router.get('/myChallenges', auth.privated, (req, res) => {
	const user = req.user;
	knex.table('ChallengeAcceptant').where({sdt: user.sdt }).then(
		(data) => {
			res.json(data[0]);
		},
		(err) => {
			res.json(err);
		}
	);
});

router.post('/register', (req, res) => {
	knex('Users').insert(req.body).then(
		(data) => {
			res.json(data);
		},
		(err) => {
			res.json(err);
		}
	);
});

router.post('/join', (req, res) => {
	knex('ChallengeAcceptant').insert(req.body).then(
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

	knex.table('Users')
		.where({ id: user.id })
		.update({ oneSignal: body.oneSignal })
})

module.exports = router;
