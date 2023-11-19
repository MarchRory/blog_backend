const http_code = require("../../../utils/code")
const { commentsModel, childrenCommentsModel } = require("../../../model/comments/index")
const { articleModel } = require("../../../model/articles/index")
const mongoose = require("mongoose")
/**
 * 根据评论时间和楼层id, 将一维评论列表转换为二维列表
 * @param {Array} originList 原一维评论列表 
 * @return 转化后的二维列表
 */
const getCommentTwoDimensionalArray = async (originList) => {
    var res = []
    // 先转换为二维数组
    for (let slow = 0; slow < originList.length; slow++ ) {
        let comment = JSON.parse(JSON.stringify(originList[slow]))
        res.push(comment)
        res[slow]['children'] = []
        for(let fast = slow+1; fast < originList.length; fast++){
            if(originList[slow].commentId == originList[fast].floorId){
                let childComment = JSON.stringify(originList[fast]);
                res[slow]['children'].push(childComment)
                originList.splice(fast, 1)
            }
        }
    }
    // 对一级评论按时间降序排序
    res.sort((comment1, comment2) => comment2.time - comment1.time)
    // 对每一级评论的子评论按时间降序排序
    res.map((comment) => {
        if(comment.children.length>1){
            comment.children.sort((comment1, comment2) => comment2.time - comment1.time)
        }
        return comment
    })
    return res
}

// 对文章新增评论
const addComment = async (newComment) => {
    let code = http_code.success
    let newCommentRes
    delete newComment['commentId']
    try{
        if(newComment['floorId']){
            // 子评论
            newCommentRes = await childrenCommentsModel.create({
                commentId: new mongoose.Types.ObjectId(),
                ...newComment
            })
            await commentsModel.findOneAndUpdate(
                { commentId: newComment.floorId },
                { $inc: { childCommentCnt: 1 } }
            )
            await childrenCommentsModel.findOneAndUpdate(
                { commentId: newComment.reviewedCommentId },
                { $inc: { childCommentCnt: 1 } }
            )
        }else{
            // 父评论
            newCommentRes = await commentsModel.create({
                commentId: new mongoose.Types.ObjectId(),
                ...newComment
            }) 
        }
        await articleModel.findOneAndUpdate(
            { articleId: newComment.articleId },
            {  $inc: { commentCnt: 1 }  },
        )
    }catch(e){
        code = http_code.error
        console.log(`评论${newComment.content}添加失败: `, e)
    }

    return { code: code, result: newCommentRes.commentId }
}

// 删除某一条评论
const delComment = async ({articleId, commentId, parentCommentId}) => {
    let code = http_code.success
    let total = 0
    try {
        if(parentCommentId == commentId){
            let doc = await commentsModel.findOne({ commentId: commentId })
            await commentsModel.deleteOne({ commentId: commentId })
            await childrenCommentsModel.deleteMany({ floorId: commentId })
            total = doc.childCommentCnt+1
            await commentsModel.findOneAndUpdate(
                { commentId: parentCommentId },
                { $inc: { commentCnt: -total } }
            )
        }else{
            total = 1
            await childrenCommentsModel.deleteOne({ commentId: commentId })
            await commentsModel.findOneAndUpdate(
                { commentId: commentId },
                { $inc: { childCommentCnt: -1 } }
            )
        }
        await articleModel.findOneAndUpdate(
            { articleId: articleId },
            { $inc: { commentCnt: -total } }
        )
    }catch(e){
        code = http_code.error
        console.log(`Id为${commentId}的评论删除失败: `, e)
    }
    return code
}

// 获取某一篇文章的一级评论列表
const getCommentList = async ({ articleId, blogOwnerEmail, pageNum, pageSize }) => {
    let code = http_code.success
    let list = []
    let parentTotal = 0
    let allCommentTotal = 0
    try {
        list = await commentsModel.find({ articleId: articleId }, { _id: 0, __v: 0 }).skip((pageNum-1)*pageSize).limit(pageSize || 10)
        list = list.sort((comment1, comment2) => comment2.time - comment1.time)
        list = list.map(((item) => {
            item['children'] = []
            return item
        }))
        parentTotal = await commentsModel.countDocuments({ articleId: articleId })
        allCommentTotal = parentTotal + await childrenCommentsModel.countDocuments({ articleId: articleId })
    }catch(e){
        code = http_code.error
        console.log('获取文章评论列表失败: ', e)
    }
    
    return { code: code, result: { list: list, parentTotal: parentTotal, allCommentTotal: allCommentTotal  } }
}

// 获取某一父级评论的子评论列表
const getChildrenCommentList = async (parentCommentId) => {
    let code = http_code.success
    let list = []
    try {
        list = await childrenCommentsModel.find({ floorId: parentCommentId }, { _id: 0, __v: 0 })
    }catch(e){
        code = http_code.error
        console.log('获取子评论列表失败: ', e)
    }
    return { code: code, result: { list: list } }
}

module.exports = { addComment, delComment, getCommentList, getChildrenCommentList }