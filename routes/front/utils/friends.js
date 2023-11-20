const { userModel } = require("../../../model/userInfo/index")
const http_code = require("../../../utils/code")

const getFriendsList = async ({ pageNum, pageSize }) => {
    let code = http_code.success
    let result = {}
    try {
        let _id = await userModel.findOne().userId
        let list = await userModel.find({userId: { $ne: _id }}, { _id: 0, __v: 0 }).skip((pageNum-1) * pageSize).limit(pageSize || 10)
        let total = await userModel.countDocuments({ userId: { $ne: _id } })
        result = { list: list, total: total }
    }catch(err){
        code = http_code.error
        result = null
        console.log('前台查询友链列表时出现异常: ', err)
    }
    return { code: code, result: result }
}



module.exports = { getFriendsList }