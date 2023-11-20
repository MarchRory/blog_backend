const { userModel } = require("../../../model/userInfo/index")
const mongoose = require("mongoose")
const { deleteAvatarInCOS } = require('../../upload/index')
const http_code = require("../../../utils/code")

const searchFriends = async ( authorId, keywords, pageNum, pageSize) => {
    let list = []
    let total = 0
    let code = http_code.success
    try {
        if(!keywords){
            let _id = new mongoose.Types.ObjectId(authorId)
            list = await userModel.find({userId: { $ne: _id }}, { _id: 0, __v: 0 }).skip((pageNum-1) * pageSize).limit(pageSize || 10)
            total = await userModel.countDocuments({ userId: { $ne: _id } })
        }else{
            let reg = new RegExp(keywords, 'i')
            list = await userModel.find({$and: [{userId: {$ne: authorId}, nickname: {$regex: reg}}]}, { _id: 0, __v: 0 }).skip((pageNum-1) * pageSize).limit(pageSize || 10)
            total = await userModel.countDocuments({nickname: { $regex: reg }})
        }
    }catch (err) {
        console.log(err)
        code = http_code.error
    }
    return { code: code, list:list, total:total }
} 

const addFriend = async ({nickname, homePath, avatar, introduce}) => {
    let flag = http_code.error
    await userModel.create({
        userId: new mongoose.Types.ObjectId(),
        nickname: nickname,
        homePath: homePath,
        avatar: avatar,
        introduce: introduce
    }).then(() => {
        flag = http_code.success
    }).catch((err) => {
        if(err.message.indexOf('duplicate key error')!==-1){
            console.log('存在重复key', err.keyPattern)
        }else {
            Object.entries(err).map(([key, value]) => {
                console.log(`error: ${key}, ${value.message}`)
            })
        }
        flag = http_code.error
    })

    return flag
} 

/**
 * 
 * @param {*} friendId 
 * @param {*} friendForm 这里面不包含userId
 * @returns 
 */
const updateFriend = async (friendId, friendForm) => {
    let flag = await userModel.findOneAndUpdate(
        { userId: friendId }, 
        { $set: { ...friendForm } },
        { new: true }
    )
    return flag ? http_code.success : http_code.error
}

const delFri = async (friendId) => {
    let code = http_code.success
    let info = await userModel.findOne({ userId: friendId })
    let { avatar } = info
    await userModel.deleteOne({userId: friendId})
    .then(() => {
        
    })
    .catch((err) => {
        console.log('del_fri_res: ', err)
        code = http_code.error
    })
    code = await deleteAvatarInCOS(avatar)
    return code
}

module.exports = { searchFriends, addFriend, updateFriend, delFri }