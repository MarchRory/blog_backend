const { userModel, accountModel, contactModel } = require('../../../model/userInfo/index')
const mongoose = require('mongoose')
const http_code = require('../../../utils/code')

const addUser = (userId, nickname, homePath, avatar, introduce='') => {
    return userModel.create({
        userId: userId,
        nickname: nickname,
        homePath: homePath,
        avatar: avatar,
        introduce: introduce
    })
}

const searchUser = async (userId) => {
    // 第二个配置项, 通过设置0来选择哪些属性不被查找
    let code = http_code.success
    let result
    try{
        result = await userModel.findOne({ userId: userId }, { _id: 0, __v: 0, userId: 0})
    }catch(err){
        result = null
        code = http_code.error
        console.log('用户信息获取异常: ', err)
    }
    return {
        code: code,
        result: result
    }
}

const searchContact = (userId) => {
    return contactModel.findOne({ userId: userId }, { _id: 0, __v: 0, _infoId: 0})
}

const updateBaseInfo = async (userId, baseInfo) => {
    let code = http_code.success
    try{
        await userModel.findOneAndUpdate(
            { userId: userId },
            {$set: { userId: userId, ...baseInfo }},
        )
    }catch (err) {
        code = http_code.error
        console.log('更新基本信息出现异常: ', err)
    }
    return code
}

const updateContact = async (userId, contact) => {
    let code = http_code.success
    try{
        await contactModel.findOneAndUpdate(
            { userId: userId },
            { $set: { ...contact } }
        )
    }catch(err){
        console.log('联系信息更新出现异常: ', err)
        code = http_code.error
    }
    return code
}

const createContact = async (userId, contact) => {
    let code = http_code.success
    try{
        contactModel.create({
            infoId: new mongoose.Types.ObjectId(),
            userId: userId,
            ...contact
        })
    }catch(err){
        console.log('创建联系方式时出现异常: ', err)
        code = http_code.error
    }
    return code
}
module.exports = { addUser, searchUser, updateBaseInfo, updateContact, createContact, searchContact  }