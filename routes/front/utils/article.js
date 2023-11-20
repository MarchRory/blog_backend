const { articleModel } = require("../../../model/articles/index")
const http_code = require("../../../utils/code")


const getArticlesList = async (tagId, { pageNum, pageSize }) => {
    let code = http_code.success
    let result = {}
    try {
        let list = await articleModel.find({ tagId: tagId }, { _id: 0, __v: 0, content: 0,  }).skip((pageNum-1) * pageSize).limit(pageSize || 10)
        let total = await articleModel.countDocuments({ tagId: tagId })
        result = { list: list, total: total }
    }catch (err) {
        code = http_code.error
        result = null
        console.log('前台获取文章列表出现异常: ', err)
    }

    return {
        code: code,
        result: result
    }
}

const getArticleDetail =  async (articleId) => {
    let code = http_code.success
    let mdBuffer
    try {
        await articleModel.findOne({ articleId: articleId })
        .then((res) => {
            const { content } = res
            mdBuffer = content
        }).catch((err) => {
            console.log('前台获取md文档出现异常: ', err)
        })
    }catch (err) {
        result = null
        code = http_code.error
        console.log('前台获取文章详情时出现异常: ', err)
    }
    return { code: code, result: mdBuffer }
}

module.exports = { getArticlesList, getArticleDetail }