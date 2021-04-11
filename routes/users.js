const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const prefix = '/api/users'
const router = Router({ prefix: '/api/users' })
// const router = Router({prefix: prefix});
const auth = require('../controllers/auth')
const model = require('../models/users')
const peut =require('../permissions/users')
const {validateUser,validateUpdate,ValidateAddAdmin} = require('../controllers/validation')
// routes :
router.get('/',auth,getAllUsers)
router.post('/login',auth,login)
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
            ctx.status=200
            ctx.body=permission.filter(userList)
        }else{
            ctx.status= 403
        }
    }else{ctx.status= 403}
}
async function addAdmin(cnx) {
    console.log('Registering ....')
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
                cnx.status=200
//               `${ctx.protocol}://${ctx.host}${prefix}/${ID}`
//                 cnx.body={ID:id,created:true,link:`/api/users/${id}`}
                cnx.body= {links:`${cnx.protocol}://${cnx.host}${prefix}/${id}`}
                //removing signup code from db:
                // const deleteCode= await modelSignupCode.deleteCode(signUpCode)
            }
            console.log('User trying to register:')
            
        }else{
            cnx.status=404
            cnx.body={Error:'Invalid code'}
        }
    }else{
    // register user as public user:
        let result =await model.addUser(user)
        if (result.affectedRows) {
            const id = result.insertId
            cnx.status=200
            cnx.body={ID:id,created:true,links:`${cnx.protocol}://${cnx.host}${prefix}/${id}`}
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
        cnx.body={Error:'User not found'}
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
                cnx.body={ID: id, updated: true,links:`${cnx.protocol}://${cnx.host}${prefix}/${id}`}
            }
        }else{
            cnx.status=403
        }
    }else{
        cnx.status=404
    }
}

async function login(ctx){
    const {ID,username,email,avatarURL}=ctx.state.user
    const links ={
        self: `${ctx.protocol}://${ctx.host}${prefix}/${ID}`
    }
    ctx.body={ID, username, email, avatarURL, links}
}
module.exports = router