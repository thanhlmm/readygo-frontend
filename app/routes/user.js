const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');

const config = require('../config');
const knex = require('../db');

router.get('/login', (req, res) => {
	// Check db here
	const token = jwt.sign(
		{
			user: 'minhthanh'
		},
		config.secret
	);
	res.end(token);
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

module.exports = router;
