const Koa = require('koa');
// const serve = require('koa-static-folder')
const app = new Koa();
const users = require('./routes/users.js') // importing users enpoint routres 
const employeeCode= require('./routes/signUpCodes.js')
// const upload =require('./routes/upload')
const centers =require('./routes/centers.js')
app.use(centers.routes())
app.use(users.routes())
// app.use(upload.routes())
app.use(employeeCode.routes())
// app.use(serve('./uploads'))
let port = process.env.PORT || 5000;
app.listen(5000);