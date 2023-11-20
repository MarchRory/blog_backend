const { model } = require("mongoose")
const mongoose = require("../DB")
var { Schema } = mongoose

/* 创建文档集合对象, 其中定义了该集合的文档中的属性和类型 */
// 账号密码
var accountSchema = new Schema({
    username: String,
    password: String,
    token: String
})

// 用户信息模型
var userSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,           // 用户id
        required: true,
        unique: true
    },              
    nickname: String,                                   // 昵称
    homePath: String,                                   // 主页路径
    avatar: String,                                     // 用户头像 url
    introduce: String,                                  // 用户简介
})

// 用户联系方式
var contactSchema = new Schema({
    infoId: {
        type: mongoose.Schema.Types.ObjectId,           // 用户id
        required: true,
        unique: true
    },
    userId: String,
    github: String,                                     // github 地址
    gitee: String,                                      // gitee 地址
    csdn: String,                                       // CSDN地址
    juejin: String,                                     // 掘金地址
    email: String,                                      // 邮箱
})

/* 创建模型对象, 这是对文档操作的封装对象, 通过模型对象可以实现对文档的 CRUD 操作 */
// const userModel = mongoose.model('users', userSchema)
const contactModel = mongoose.model('contacts', contactSchema)
const userModel = mongoose.model('userInfos', userSchema)
const accountModel = mongoose.model('users', accountSchema);

module.exports = {  accountModel, contactModel, userModel }
