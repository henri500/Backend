const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
//const { hash } = require('bcrypt');
const router = Router({ prefix: '/api/signupcode' });


const model = require('../models/signupcode');

router.post('/add',bodyParser(),addCode)
router.get('/:code',getCode)
router.del('/delete/:code',deleteCode)
async function addCode(cnx) {
    //dont forget to make this accessioble only by admin
    let code  =cnx.request.body
    let response = await model.addCode(code)
    if (response.affectedRows){
        const id = response.insertId
        cnx.status= 201
        cnx.body={ID:id,added:true,link:`${cnx.request.path}/${id}`}
    }else{
        cnx.body='error'
    }
    // console.log(response)
}

async function getCode(cnx) {
    let codeCheck = cnx.params.code
    let exist = await model.getCode(codeCheck)
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