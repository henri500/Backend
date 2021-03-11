const Koa = require('koa');
const app = new Koa();
const users = require('./routes/users.js') // importing users enpoint routres 
const employeeCode= require('./routes/signUpCodes.js')
app.use(users.routes())
app.use(employeeCode.routes())
let port = process.env.PORT || 5000;
app.listen(5000);