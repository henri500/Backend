const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
//const { hash } = require('bcrypt');
const router = Router({ prefix: '/api/signupcode' });
const {signUpCodeCreate} = require('../controllers/validation');

const model = require('../models/signupcode');
router.get('/',getAllCodes)
router.post('/add',bodyParser(),signUpCodeCreate,addCode)
router.get('/:code',getCode)
router.del('/delete/:code',deleteCode)

async function getCode(cnx) {
    let codeCheck = cnx.params.code
    let exist = await model.getCode(codeCheck)
    if (exist!=0) {
        cnx.status =200
        cnx.body=exist
    }else{
        cnx.status =404
        cnx.body={code:codeCheck,found:false}
    }
}
async function addCode(cnx) {
    //checkin if  code exist;
    let exist = await model.getCode(cnx.request.body)

    if (exist !=0) {
        let code  =cnx.request.body
        let response = await model.addCode(code)
        if (response.affectedRows){
            const id = response.insertId
            cnx.status= 201
            cnx.body={ID:id,added:true,link:`${cnx.request.path}/${id}`}
        }
    }else{
        cnx.status=406
        cnx.body={code: cnx.request.body.code, added: false,message:"Code already present"}
    }
    // console.log(response)
}

async function getAllCodes(cnx) {
    let exist = await model.getCodes()
    if (exist.length) {
        cnx.status =200
        cnx.body=exist
    }
}

async function deleteCode(cnx){
    let code = cnx.params.code
    let deleted = await model.deleteCode(code)
    if (deleted.affectedRows) {
        const id = code
        cnx.body={code:id,deleted:true}
    }
}
module.exports = router;