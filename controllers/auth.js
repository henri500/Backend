const basicAuth = require('../strategies/basic');
const passport = require('koa-passport');

passport.use(basicAuth);
module.exports = passport.authenticate(['basic'], {session:false});