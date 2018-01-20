const express = require('express')
const router = express.Router()

const jwt = require('jsonwebtoken');

const config = require('../config');
const knex = require('../db');

router.get('/', (req, res) => {
  knex.table('Challenges').then(data => {
    res.json(data);
  }, (err) => {
    res.json(err)
  });
})

router.post('/:id/join', (req, res) => {
  const id = req.params.id;
  
  knex.table('Challenges').then(data => {
    res.json(data);
  }, (err) => {
    res.json(err)
  });
})

module.exports = router;
