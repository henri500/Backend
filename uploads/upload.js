
const { copyFileSync } = require('fs')
const { v4: uuidv4 } = require('uuid')

const upload_option={
    multipart:true,
    formidable:{
        upload_dir:'/tmp/api/uploads'
    }
}

const mime = require('mime-types');
const fileStore = '/var/tmp/public/images'

exports.uploadFile = async function uploadFile (cnx) {
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
        return imageName

    } catch(err){
        console.log(`error ${err.message}`)
        uploadFile.throw(500, 'upload error', {message: err.message});
    }
}