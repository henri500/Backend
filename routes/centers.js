const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const router = Router({ prefix: '/api/centers' })
const auth = require('../controllers/auth')
const model =require('../models/centers') 
const { update } = require('../permissions/users')
const{validateAddCenter,validateUpdateCenter} = require('../controllers/validation')

router.get ('/',getAll)
router.get ('/:id([0-9]{1,})',getCenter)
router.post('/add',bodyParser(),auth,validateAddCenter,addCenter)
router.del('/delete/:id([0-9]{1,})',bodyParser(),auth,deleteCenter)
router.put('/update/:id([0-9]{1,})',bodyParser(),auth,validateUpdateCenter,updateCenter)
// router.get('/find/:center')

// get all centers 
async function getAll(cnx) {
    const allCenters = await model.getAllCenters()
    if (allCenters.length) {
        cnx.status =200
        cnx.body=allCenters
    }else{
        cnx.status=404
    }
}
async function getCenter(cnx) {
    const center = await model.getCenter(cnx.params.id)
    if (center.length) {
        cnx.status =200
        cnx.body=center
    }else{
        cnx.status=404
    }
}
//getting  a specific center
async function addCenter(cnx) {
    //if user is and admin :
    if(cnx.state.user.roleID=='admin'){
        // checking if center with the same and addres exixt already:
        const _exists= await model.getCenterByNameAndAddress(cnx.request.body)
        if(_exists.length){
            cnx.status=406
            cnx.body={Error: "Center with the same Nmae and/or address already present"}

        }else{
            const center = await model.addCenter(cnx.request.body)
            if (center.affectedRows) {
                cnx.status =200
                cnx.body={ID:center.insertId,created:true,link:`/api/centers/${center.insertId}`}
            }else{
                cnx.status=404
            }
        }
    }else{
        cnx.status=403
    }
}
// deleting  a specific center
async function deleteCenter(cnx) {
    const center = await model.deleteCenter(cnx.params.id)
    if (center.affectedRows) {
        cnx.status =200
        cnx.body={ID:cnx.params.id,deleted:true}
    }else{
        cnx.status=404
    }
}

async function updateCenter(cnx) {
    //chekin if user has admin role:
    if (cnx.state.user.roleID=='admin'){
        //checking another center already has the these details:
        const _exists= await model.getCenterByNameAndAddress(cnx.request.body)
        if (_exists.length){
            cnx.status=406
            cnx.body={Error:"Another Center Already has thos details"}
        }else{
            cnx.request.body.ID = cnx.params.id
            const center = await model.updateCenter(cnx.request.body)
            if (center.affectedRows) {
                cnx.status =200
                cnx.body={ID:cnx.params.id,update:true}
            }else{
                cnx.status=404
            }
        }
    }else{
        cnx.status=403
    }
}




module.exports = router