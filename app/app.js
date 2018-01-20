const express = require('express')
const path = require('path')
const logger = require('morgan')
const bodyParser = require('body-parser')

const app = express()

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/user', require('./routes/user'))

app.use((req, res) => {
  res.end('hello world');
})

app.listen(3000, (err) => {
  if (err) console.log(err)
  console.log('Your sever is up at 3000');
})

module.exports = app
