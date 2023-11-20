var express = require('express');
var uploadRouter = express.Router();
const { upload } = require('./util');
const { pack } = require('../../utils');
const http_code = require('../../utils/code');
const COS = require("cos-nodejs-sdk-v5")
const fs = require("fs")
const avatar_Bucket = {
    Bucket: 'blog-avatar-1321070494',
    Region: 'ap-guangzhou'
}
const note_Bucket = {
    Bucket: 'note-md-1321070494',
    Region: 'ap-guangzhou'
}
const cos = new COS({
    SecretId: import.meta.APP_COS_SECRET_ID,
    SecretKey: import.meta.APP_COS_SECRET_KEY,
    Timeout: 5 * 1000,
})
//     Proxy: `http://10.0.8.16:8888`,


/* GET home page. */
// COS头像存储
uploadRouter.post('/avatar',  upload.single('avatar'),  async (req, res) => {
    console.log(req.file)
    let avatarPath = `uploads/${req.file.filename}`.replaceAll('\\', '/')
    let splitArr = avatarPath.split('.')
    let type = splitArr[splitArr.length-1]
    let imgURL = ''
    let code = http_code.success
    cos.putObject({
        Bucket: avatar_Bucket.Bucket,
        Region: avatar_Bucket.Region,
        Key: req.file.originalname,
        Body: fs.createReadStream(avatarPath), // 上传文件对象
        ContentType: `image/${type}`,
        ContentDisposition: `inline;filename=${req.file.filename}`,
    }, (err, data) => {
        if(err){
            console.log("avatarUploadErr: ", err)
            code = http_code.error
            imgURL = null
        }else {
            console.log('avatarUploadSucc')
            const { statusCode, Location } = data
            imgURL = statusCode===200 ? 'https://'+Location : ''
            code = statusCode
            fs.unlink(`uploads/${req.file.filename}`, (err) => {
                if(err){
                    console.log('err: ', err)
                }
            }) 
        }
        res.status(code).send(pack(code, imgURL))
    })

});

uploadRouter.post('/cover',  upload.single('cover'),  async (req, res) => {
    let coverPath = `uploads/${req.file.filename}`.replaceAll('\\', '/')
    let splitArr = coverPath.split('.')
    let type = splitArr[splitArr.length-1]
    let imgURL = ''
    let code = http_code.success
    cos.putObject({
        Bucket: note_Bucket.Bucket,
        Region: note_Bucket.Region,
        Key: req.file.originalname,
        Body: fs.createReadStream(coverPath), // 上传文件对象
        ContentType: `image/${type}`,
        ContentDisposition: `inline;filename=${req.file.filename}`,
    }, (err, data) => {
        if(err){
            console.log("coverUploadErr: ", err)
            code = http_code.error
            imgURL = null
        }else {
            console.log('coverUploadSucc')
            const { statusCode, Location } = data
            imgURL = statusCode===200 ? 'https://'+Location : ''
            code = statusCode
            fs.unlink(`uploads/${req.file.filename}`, (err) => {
                if(err){
                    console.log('err: ', err)
                }
            })
        }
        res.status(code).send(pack(code, imgURL))
    })

});

// COS头像资源删除
uploadRouter.delete('/:filename', async(req, res) => {
    let fileKey = req.params.filename
    let code = http_code.success
    let result = true
    cos.deleteObject({
        Bucket: avatar_Bucket.Bucket,
        Region: avatar_Bucket.Region,
        Key: fileKey
    }, (err, data) => {
        if(err){
            code = http_code.error
            result = false
        }
        res.status(code).send(pack(code, result))
    })
})

// COS封面资源删除
uploadRouter.delete('/:filename', async(req, res) => {
    let fileKey = req.params.filename
    let code = http_code.success
    let result = true
    cos.deleteObject({
        Bucket: note_Bucket.Bucket,
        Region: note_Bucket.Region,
        Key: fileKey
    }, (err, data) => {
        if(err){
            code = http_code.error
            result = false
        }
        res.status(code).send(pack(code, result))
    })
})

// md笔记存储
uploadRouter.post('/', async(req, res) => {

})

// 封装API - COS封面图删除, 需要传入图片的url
const deleteCoverInCOS = async (fileUrl) => {
    let arr = fileUrl.split('/')
    console.log(arr)
    let key = arr[arr.length-1]
    let res = http_code.success
    cos.deleteObject({
        Bucket: note_Bucket.Bucket,
        Region: note_Bucket.Region,
        Key: key
    }, (err, data) => {
        if(err){
            console.log("COS中封面删除失败: ", err)
            res = http_code.error
        }
        if(data){
            console.log(`封面${key}删除成功: `, data)
        }
    })
    return res
}
// 封装API - COS头像删除， 需要传入图片的url
const deleteAvatarInCOS = async (fileUrl) => {
    let arr = fileUrl.split('/')
    console.log(arr)
    let key = arr[arr.length-1]
    let res = http_code.success
    cos.deleteObject({
        Bucket: avatar_Bucket.Bucket,
        Region: avatar_Bucket.Region,
        Key: key
    }, (err, data) => {
        if(err){
            console.log("COS中头像删除失败: ", err)
            res = http_code.error
        }
        if(data){
            console.log(`头像${key}删除成功: `, data)
        }
    })
    return res
}

module.exports = { uploadRouter, deleteCoverInCOS, deleteAvatarInCOS };