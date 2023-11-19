const multer = require('multer')  // 可以用来处理图片
const path = require('path')

const saveImg = multer.diskStorage({
    // 设置图片保存位置
    destination: function(req, file, callback){
        callback(null, './uploads')
    },
    // 设置图片名
    filename: function(req, file, callback){
        callback(null, `${Date.now()}_${file.originalname}`)
    }
})

const upload = multer({ storage: saveImg })

module.exports = { upload }

