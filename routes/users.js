const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const router = Router({ prefix: '/api/users' })
const auth = require('../controllers/auth')
const model = require('../models/users')
const peut =require('../permissions/users')
const {validateUser,validateUpdate,ValidateAddAdmin} = require('../controllers/validation')
// routes :
router.get('/',auth,getAllUsers)
router.post('/admin/add',bodyParser(),auth,ValidateAddAdmin,addAdmin)
router.post('/add',bodyParser(),validateUser,addUser)
router.get('/:id([0-9]{1,})',auth,getUser)
router.del('/delete/:id([0-9]{1,})',auth,deleteUser)
router.put('/update/:id([0-9]{1,})',bodyParser(),auth,validateUpdate,updateUser)

// list all user in DB
async function getAllUsers(ctx){
    const permission = peut.readAll(ctx.state.user)
    console.log(permission.granted)
    if (permission.granted){
        const userList= await model.getAll()
        if(userList.length){
            ctx.body=permission.filter(userList)
        }else{
            ctx.status= 403
        }
    }else{ctx.status= 403}
}
async function addAdmin(cnx) {
    const permission=peut.addAdmin(cnx.state.user)
    if(permission.granted){
        cnx.request.body.roleID='admin'
        let user=cnx.request.body
        const result = await model.addUser(user)
        if (result == 0) {
            cnx.status=406
            cnx.body={Error:" User Already with that username and/or email already exist"}
        }else if(result.affectedRows){
            const id = result.insertId
            cnx.status=201
            cnx.body={ID:id,created:true,link:`/api/users/${id}`}
        }
    }else{
        cnx.status=403
    }
    
}
// create new public/user
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
            if (result == 0) {
                cnx.status=406
                cnx.body={Error:" User Already with that username and/or email already exist"}
            }
            if (result.affectedRows) {
                const id = result.insertId
                cnx.status=201
                cnx.body={ID:id,created:true,link:`/api/users/${id}`}
                //removing signup code from db:
                // const deleteCode= await modelSignupCode.deleteCode(signUpCode)
            }
            
        }else{
            cnx.status=404
            cnx.body={signupCode:'Invalid'}
        }
    }else{
    // register user as public user:
        let result =await model.addUser(user)
        if (result.affectedRows) {
            const id = result.insertId
            cnx.status=201
            cnx.body={ID:id,created:true,link:`/api/users/${id}`}
        }
        if (result == 0) {
            cnx.status=406
            cnx.body={Error:" User Already with that username and/or email already exist"}
        }
    }
}

//get get user by Id
async function getUser(cnx) {
    const userID =cnx.params.id
    const user = await model.getUserID(userID)
    if (user.length) {
        const data =user[0]
        const permission = peut.read(cnx.state.user,data)
        if(permission.granted){
            // cnx.body=user
            cnx.body=permission.filter(data)
        }
        else{
            cnx.status=403
        }
    } else {
        cnx.status=404
        cnx.body="User not found"
    }
}


async function deleteUser(cnx) {
    if (cnx.params.id){
        const userID = cnx.params.id
        const exist= await model.getUserID(cnx.params.id)
        if (exist.length){
            data=exist[0]
            const permission = peut.delete(cnx.state.user,data)
            if (permission.granted){
                const deleted= await model.deleteUser(userID)
                console.log(deleted)
                if (deleted.affectedRows) {
                    cnx.status=200
                    cnx.body={ID: userID, deleted: true}
                }else{
                    cnx.status=404
                    cnx.body={ID: userID, deleted: false}
                }
            }else{
                cnx.status=403
            }
        }else{
            cnx.status=404
            cnx.body={ID: userID, deleted: false}
        }
    }
}


async function updateUser(cnx) {
    // checking if user exist 
    const id = cnx.params.id
    let user = await model.getUserID(id)
    if (user.length) {
        const data=user[0]
        const permission = peut.update(cnx.state.user,data)
        if (permission.granted){
            cnx.request.body.ID=id
            const updated = await model.updateUser(cnx.request.body)
            if (updated.affectedRows) {
                cnx.status=200
                cnx.body={ID: id, updated: true}
            }
        }else{
            cnx.status=403
        }
    }else{
        cnx.status=404
    }
}



module.exports = router