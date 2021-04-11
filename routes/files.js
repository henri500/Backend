
const Router = require('koa-router')
const { copyFileSync } = require('fs')
const { v4: uuidv4 } = require('uuid')
const {existsSync, createReadStream } = require('fs')
const router = Router({ prefix: '/api/images' })
const auth = require('../controllers/auth')
const fileStore = '/var/tmp/public/images'
router.get('/', '/:uuid([0-9a-f\\-]{36})', async ctx => {
    const uuid = ctx.params.uuid
    const path = `${fileStore}/${uuid}`
    console.log(ctx.hostname)
    console.log('client requested image with path', path)
    try {
        if (existsSync(path)) {
            console.log('image found');
            const src = createReadStream(path);
            ctx.type = 'image/jpeg';
            ctx.body = src;
            ctx.status = 200;
            } else {
                console.log('image not found');
                ctx.status = 404;
            }
    } catch (err) {
    console.log(`error ${err.message}`)
    ctx.throw(500, 'image download error', {message: err.message})
    }
})

const upload_options={
    multipart:true,
    formidable:{
        upload_dir:'/tmp/api/uploads'
    }
}
const koaBody = require('koa-body')(upload_options)
router.post('/',auth,koaBody,uploadFile)
const mime = require('mime-types');
async function uploadFile(cnx) {
    try{
        const {path, name, type} = cnx.request.files.upload
        const extension = mime.extension(type)
        console.log('Uploaded file details:')
        console.log(`path: ${path}`)
        console.log(`filename: ${name}`)
        console.log(`type: ${type}`)
        console.log(`extension: ${extension}`)
        const imageName = uuidv4()
        const newPath = `${fileStore}/${imageName}`
        copyFileSync(path, newPath)
        cnx.body={ 
            links:{
                path: router.url('/', imageName)
            }
        }
        

    } catch(err){
        console.log(`error ${err.message}`)
        cnx.throw(500, 'upload error', {message: err.message});
    }
}

module.exports = router