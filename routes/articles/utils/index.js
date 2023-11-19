const { articleModel } = require("../../../model/articles/index")
const { tagModel } = require("../../../model/tags/index")
const { deleteCoverInCOS } = require('../../upload/index')
const mongoose = require("mongoose")
const md = require("markdown-it")()
const http_code = require("../../../utils/code")

const searchArticleList = async ( {tagId, keywords, pageNum, pageSize} ) => {
    let list = []
    let total = 0
    let code = http_code.success
    try {
        if(!keywords){
            list = await articleModel.find({ tagId: tagId }, { _id: 0, content: 0, _v: 0 }).skip((pageNum-1)*pageSize).limit(pageSize || 10)
            total = await articleModel.countDocuments({ tagId: tagId })
        }else {
            let reg = new RegExp(keywords, 'i')
            list = await articleModel.find({ tagId: tagId, title: {$regex: reg} }, { _id: 0, content: 0, _v: 0 }).skip((pageNum-1)*pageSize).limit(pageSize || 10)
            total = await articleModel.countDocuments({ tagId: tagId, title:{$regex: reg} }) 
        }
    }catch (err) {
        console.log('search_articleList_error: ', err)
        code = http_code.error
    }

    return { 
        code: code,
        list: list,
        total: total
    }
}

const addArticle = async ({ tagId, summary, cover, title, content, publishTime }) => {
    let flag = http_code.success
    await articleModel.create({
        articleId: new mongoose.Types.ObjectId(),
        tagId: tagId,
        summary: summary,
        cover: cover,
        title: title,
        publishTime: Date.now(),
        updateTime: publishTime,
        views: 0,
        content: content,
        commentCnt: 0
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
    await tagModel.findOneAndUpdate(
        { tagId: tagId },
        {  $inc: { hasNums: 1 }  },
    )

    return flag
}

const updateArticle = async ({ articleId, updatedArticle }) => {
    let flag = await articleModel.findOneAndUpdate(
        { articleId: articleId },
        { $set: {...updatedArticle} },
        { new: true }
    )
    return flag ? http_code.success : http_code.error
}

/**
 * 根据文章id读取markdown
 * @param {string} articleId 文章id
 */
const getContent = async (articleId) => {
    let mdRes = null
    await articleModel.findOne({ articleId: articleId })
        .then((res) => {
            const { content } = res
            console.log('查找markdown文档成功: ')
            mdRes = content
        }).catch((err) => {
            console.log('查找markdown文档失败: ', err)
            mdRes = http_code.error
        })
    return mdRes
}

const delArticle = async (articleId, tagId) => {
    let code = http_code.success
    let info = articleModel.findOne({ articleId: articleId })
    let { cover } = info
    await articleModel.deleteOne({ articleId: articleId })
    .catch((err) => {
        console.log('delete article error: ', err)
        code = http_code.error
    })
    await tagModel.findOneAndUpdate(
        { tagId: tagId },
        {  $inc: { hasNums: -1 }  },
    ).catch((err) => {
        console.log('tag集合对应tag中的文章数量自减失败: ', err)
        code = http_code.error
    })
    code = await deleteCoverInCOS(cover)
    return code
}

module.exports = { searchArticleList, addArticle, updateArticle, getContent, delArticle }