const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');

const config = require('../config');
const knex = require('../db');

router.post('/addreward', (req, res) => {
	knex
		.table('Challenges')
		.where({ id: req.body['id'] })
		.then(
			(data) => {
				return data;
			},
			(err) => {
				res.json(err);
			}
		)
		.then((data) => {
			const reward = JSON.parse(data[0].reward);
			reward.push(req.body['reward']);

			knex('Challenges')
				.where({ id: data[0].id })
				.update({
					reward: JSON.stringify(reward)
				})
				.then(
					(data) => {
						res.json(data);
					},
					(err) => {
						res.json(err);
					}
				);
		});
});

module.exports = router;