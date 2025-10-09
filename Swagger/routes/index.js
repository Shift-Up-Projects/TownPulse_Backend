const auth = require('./auth');
const users = require('./users');
const activities = require('./activities');
const attendance = require('./attendance');
const reviews = require('./reviews');

// دمج كل المسارات في كائن واحد
module.exports = {
  ...auth,
  ...users,
  ...activities,
  ...attendance,
  ...reviews
};