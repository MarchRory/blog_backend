const { tagModel } = require("../../../model/tags/index")
const http_code = require("../../../utils/code")

const getTagList = async ({ keywords, pageNum, pageSize }) => {
    let code = http_code.success
    let result = {}
    try {
        let searchMethod
        let cntMethod
        if(!keywords){
            searchMethod = { hasNums: {$ne: 0} }
            cntMethod = {}
        }else {
            let reg = new RegExp(keywords, 'i')
            searchMethod = { tagname: { $regex: reg } }
            cntMethod = { tagname: { $regex: reg } }
        }
        let list = await tagModel.find(searchMethod, {__v: 0, userId: 0, _id: 0}).skip((pageNum-1) * pageSize).limit(pageSize || 10)
        let total = await tagModel.countDocuments(cntMethod)
        result = { list: list, total: total }
    }catch (err) {
        code = http_code.error
        result = null
        console.log('前台获取标签列表出错: ', err)
    }
    return { code: code, result: result }
}

module.exports = { getTagList }