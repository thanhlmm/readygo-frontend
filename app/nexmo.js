const Nexmo = require('nexmo');
const config = require('./config');

module.exports = new Nexmo({
  apiKey: '3918c6bf',
  apiSecret: '69272c2e97eafdc6',
}, {
  debug: true
});