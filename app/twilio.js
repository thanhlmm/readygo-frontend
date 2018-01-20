const twilio = require('twilio');
const config = require('./config');

module.exports = new twilio(config.twilioSid, config.twilioToken);