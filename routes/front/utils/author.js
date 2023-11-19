const { contactModel, userModel } = require("../../../model/userInfo/index")
const http_code = require("../../../utils/code")

const getAuthorInfo = async () => {
    let code = http_code.success
    let result = {}
    try {
        const baseInfo = await userModel.findOne({}, { _id: 0, __v: 0, userId: 0 })
        const contact = await contactModel.findOne({}, { _id: 0, __v: 0, infoId: 0, userId: 0 })
        result = { userInfo: baseInfo, contact: contact }
    }catch (err) {
        code = http_code.error
        result = null
        console.log('前台获取个人信息出现异常: ', err)
    }
    return {
        code: code,
        result: result
    }
}

module.exports = { getAuthorInfo }