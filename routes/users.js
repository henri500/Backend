const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
//const { hash } = require('bcrypt');
const router = Router({ prefix: '/api/users' });
// importing model for user CRUD operations:
const model = require('../models/users');

// routes :
router.get('/',getAllUsers)
// router.post('/add',bodyParser(),addUser)
// router.get('/:id([0-9]{1,})',getUser)
// router.del('/:id([0-9]{1,})',deleteUser)
// router.put('/:id([0-9]{1,})',bodyParser(),updateUser)


async function getAllUsers(ctx){
    let userList= await model.getAll()
    if(userList.length){
        ctx.body=userList
    }else{
        ctx.status= 403
    }
}


module.exports = router;