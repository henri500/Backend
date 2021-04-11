const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const router = Router({ prefix: '/api/upload' })

const multer = require("multer");
const path = require("path");

router.post('/',uploadImage)
// storage engine 
const storage = multer.diskStorage({
    destination: '../uploads/',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024*1024*5
    }
})



async function uploadImage(cnx) {
    
}



module.exports =router