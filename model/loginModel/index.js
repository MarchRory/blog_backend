const mongoose = require("../DB")
var Schema = mongoose.Schema

// 后台登录模型
var loginShema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,           // 用户id
        required: true,
        unique: true
    },  
    username: String,                                   // 账号
    password: String                                  // 密码
})

const loginModel = mongoose.model('user', loginShema)

module.exports = { loginModel }
