const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const router = Router({ prefix: '/api/listings' })
const auth = require('../controllers/auth')
const model = require('../models/listings')
const breedModel= require('../models/breeds')
const {createReadStream} = require('fs');
const fileStore = '/var/tmp/public/images'
router.get('/',bodyParser(),getAlllistings)
router.get('/:id([0-9]{1,})',getListing)
router.get('/breed/:breedName',getListingByBreedName)
router.del('/delete/:id([0-9]{1,})',auth,deleteListing)


const upload_options={
    multipart:true,
    formidable:{
        upload_dir:'/tmp/api/uploads'
    }
}
const koaBody = require('koa-body')(upload_options)
router.post('/add',auth,koaBody,AddListing) //===== CHNAGE ME ====================
const upload = require('../uploads/upload')
router.put('/update/',auth,koaBody,updateListing)
async function uploadFile(cnx) {
    console.log(cnx.request.body)
    let result = await upload.uploadFile(cnx)
    return result
}


async function getListing(cnx) {
    const  id = cnx.params.id
    const listing = await model.findListingByID(id)
    if (listing.length){
        const path = listing[0].imageURL
        console.log(path)
        const src = createReadStream(path)
        cnx.status=200
        // cnx.type = 'image/jpeg'
        // cnx.body.imageContent= path
        cnx.body=listing
    }else{
        cns.status= 404
    }
    
}

async function getAlllistings(cnx) {
    const listings = await model.getAll()
    if (listings.length){
        cnx.body=listings
    }else{
        cnx.status=404
    }
}

async function getListingByBreedName(cnx) {
    /**
     * 
     */
    

}

async function AddListing(cnx) {
    /**
     * 
     */
    const user = cnx.state.user
    if (user.roleID==='admin'|| user.roleID==='worker' ) {
        let body = cnx.request.body
        // Checking breed already exist:
        const breedExist = await breedModel.getBreedByName(body.breedName)
        if (breedExist.length){
            let filepath= await uploadFile(cnx)
            console.log(filepath)
            body.imageURL= `/api/images/${filepath}`
            body.authorID=user.ID
            body.centerID=user.centerID
            const result = await model.addListing(body)
            if (result.affectedRows) {
                const id = result.insertId
                cnx.satus= 200
                cnx.body={ID:id, created:true, 
                    link:`/api/listings/${id}`}
                    // path: router.url('get_image', imageName)}
            }
        }
    }else{
        cnx.status = 401
    }

}


async function deleteListing(cnx) {
    const id = cnx.params.id
    const response = await model.deleteListing(id)
    if (response.affectedRows){
        cnx.status=200
        cnx.body={ID:id, deleted:true}
    }else{
        cnx.status=404
        cnx.body={ID:id, deleted:true}
    }
}

async function updateListing(cnx) {
    const id = cnx.request.body.id
    let listing = await model.findListingByID(id)
    if (listing.length){
        cnx.request.body.id=id
        const response =await model.updateListing(cnx.request.body)
        if (response.affectedRows) {
            cnx.satus=200
            cnx.body={ID: id, updated: true}
        }else{
            cnx.satus=403
            cnx.body={ID: id, updated: false}
        }
    }else{
        cnx.status=404
    }
}
module.exports = router