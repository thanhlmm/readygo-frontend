const express = require('express')
const path = require('path')
const logger = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors');
const jwt = require('express-jwt');

const config = require('./config');

const app = express()

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

app.use(cors());
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(jwt({ secret: config.secret}).unless({path: ['/user/login', '/user/register']}));

app.use('/user', require('./routes/user'));
app.use('/challenges', require('./routes/challenges'));

app.use((req, res) => {
  res.end('hello world');
})

app.listen(400, (err) => {
  if (err) console.log(err)
  console.log('Your sever is up at 400');
})

module.exports = app
