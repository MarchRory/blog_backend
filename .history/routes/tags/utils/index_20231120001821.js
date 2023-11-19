const { tagModel } = require("../../../model/tags/index")
const  mongoose  = require("mongoose")
const { ObjectId } = mongoose.Types
const http_code = require("../../../utils/code")
/**
 * 有keywords就开启模糊查询
 * @param {*} userId 
 * @param {*} keywords 
 * @param {*} pageNum 
 * @param {*} pageSize 
 * @returns 
 */
const search = async (userId, keywords, pageNum, pageSize) => {
    let list = []
    let len = 0
    let code = http_code.success
    try {
        if(!keywords){
            list = await tagModel.find({ userId: userId }, {__v: 0, userId: 0, _id: 0}).skip((pageNum-1) * pageSize).limit(pageSize || 10)
            len = await tagModel.countDocuments({})
        }else {
            let reg = new RegExp(keywords, 'i')
            list = await tagModel.find({ tagname: { $regex: reg } }, { __v: 0, userId: 0 }).skip((pageNum-1) * pageSize).limit(pageSize || 10)
            len = await tagModel.countDocuments({ tagname: { $regex: reg } })
        }
    }catch(err){
        code = http_code.error
    }
    console.log('tag list: ', list)
    return {
        code: code,
        result: {
            list: list,
            total: len
        }
    }
}

const addTag = async (userId, name, icon, birth) => {
    let code = http_code.success
    await tagModel.create({
        tagId: new ObjectId(),
        userId, userId,
        tagname: name, 
        tagIcon: icon, 
        hasNums: 0, 
        publishTime:birth, 
        updateTime: 0 
    }).then((data) => {
        console.log('insert success')
    }).catch((err) => {
        if(err.message.indexOf('duplicate key error')!==-1){
            console.log('存在重复key', err.keyPattern)
        }else {
            Object.entries(err).map(([key, value]) => {
                console.log(`error: ${key}, ${value.message}`)
            })
        }
        code = http_code.error
    })
    return code
}

const delTag = async (userId, tagId) => {
    let canDel = await tagModel.findOne({$and: [{userId: userId}, { tagId: tagId }]})
    if(canDel.hasNums!==0){
        return false
    }else {
        await tagModel.deleteOne({$and: [{userId: userId}, { tagId: tagId }]})
        return true
    }
}

const updateTag = async (userId, tagId, tagname, tagIcon, updateTime) => {
    let code = http_code.success
    await tagModel.findOneAndUpdate(
            { tagId: tagId }, 
            {$set: {tagname: tagname, tagIcon: tagIcon, updateTime: updateTime}},
            { new: true }
        ).catch(err => {
            console.log('更新tag出错: ', err)
            flag = http_code.error
        })
    return code
}

module.exports = { search, addTag, delTag, updateTag }