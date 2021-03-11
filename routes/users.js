const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
//const { hash } = require('bcrypt');
const router = Router({ prefix: '/api/users' });
// importing model for user CRUD operations:
const model = require('../models/users');

// routes :
router.get('/',getAllUsers)
router.post('/add',bodyParser(),addUser)
router.get('/:id([0-9]{1,})',getUser)
router.del('/delete/:id([0-9]{1,})',deleteUser)
router.put('/update/:id([0-9]{1,})',bodyParser(),updateUser)

// list all user in DB
async function getAllUsers(ctx){
    const userList= await model.getAll()
    if(userList.length){
        ctx.body=userList
    }else{
        ctx.status= 403
    }
}

// create new user
async function addUser(cnx) {
    let  user = cnx.request.body
    //checking if user provides signup cod for employees
    if (user.code){
        const modelSignupCode = require('../models/signupcode')
        let signUpCode=user.code
        // checking if code exist:
        const codeExist= await modelSignupCode.getCode(signUpCode)
        if (codeExist.length) {
            //updating user payload:
            delete user.code
            user.centerID=codeExist[0].centerAssigned
            user.roleID='worker'
            // Adding user as worker of a charity
            const result = await model.addUser(user)
            if (result.affectedRows) {
                const id = result.insertId
                cnx.status=201
                cnx.body={ID:id,created:true,link:`/api/users/${id}`}
            }
            //removing signup code from db:
            const deleteCode= await modelSignupCode.deleteCode(signUpCode)
        }else{
            cnx.status=404
            cnx.body={signupCode:'Invalid'}
        }
    }
    // register user as public user:
    let result =await model.addUser(user)
        if (result.affectedRows) {
            const id = result.insertId
            cnx.status=201
            cnx.body={ID:id,created:true,link:`/api/users/${id}`}
        }
}

//get get user by Id
async function getUser(cnx) {
    const userID =cnx.params.id
    const user = await model.getUserID(userID)
    if (user.length) {
        cnx.body=user
    } else {
        cnx.status=404
        cnx.body="User not found"
    }  
}


async function deleteUser(cnx) {
    const userID = cnx.params.id
    const deleted= await model.deleteUser(userID)
    if (deleted.affectedRows) {
        cnx.status=201
        cnx.body={ID: userID, deleted: true}
    }
}


async function updateUser(cnx) {
    // checking if user exist 
    const id = cnx.params.id
    let user = await model.getUserID(id)
    if (user.length) {
        //console.log(user)
        cnx.request.body.ID=id
        if (cnx.request.body.username) {
            delete cnx.request.body.username 
        }
        const updated = await model.updateUser(cnx.request.body)
        console.log(cnx.request.body)
        if (updated.affectedRows) {
            cnx.status=200
            cnx.body={ID: id, updated: true}
        }
    }
}
module.exports = router;