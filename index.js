const cors = require('@koa/cors');
const Koa = require('koa');
const app = new Koa();
app.use(cors());



const users = require('./routes/users.js') // importing users enpoint routres 
const employeeCode= require('./routes/signUpCodes.js')
// const upload =require('./routes/upload')
const centers =require('./routes/centers.js')
const listings =require('./routes/listings.js')
const  download =require('./routes/files')

app.use(download.routes())
app.use(listings.routes())
app.use(centers.routes())
app.use(users.routes())
app.use(employeeCode.routes())


app.listen(5000);