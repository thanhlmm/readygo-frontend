const OneSignalClient = require('node-onesignal-api');
const config = require('./config')

module.exports = new OneSignalClient({
  appId: config.oneSignalId,
  restApiKey: config.oneSignalSecret
});