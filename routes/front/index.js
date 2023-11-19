var express = require('express');
var router = express.Router();
var { getAuthorInfo } = require('./utils/author');
var { getTagList } = require('./utils/tags')
var { getFriendsList } = require('./utils/friends')
var { getArticlesList, getArticleDetail } = require('./utils/article')
var { addComment, delComment, getCommentList, getChildrenCommentList } = require('./utils/comment')
const { pack } = require('../../utils');


// 获取用户信息
router.get('/authorInfo', async (req, res) => {
    const { code, result } = await getAuthorInfo()
    res.status(code).send(pack(code, result))
})

// 获取tagList列表
router.get('/tagList', async (req, res) => {
    const { code, result } = await getTagList({ ...req.query })
    res.status(code).send(pack(code, result))
})

// 获取文章列表
router.get('/articlesList', async(req, res) => {
    const { tagId, pageNum, pageSize } = req.query
    const { code, result } = await getArticlesList(tagId, {pageNum, pageSize})
    res.status(code).send(pack(code, result))
})

// 获取文章详情
router.get('/getArticleDetail', async (req, res) => {
    const { articleId } = req.query
    const { code, result } = await getArticleDetail(articleId)
    res.status(code).send(pack(code, result))
})

// 分页获取友链列表
router.get('/friends', async (req, res) => {
    const { code, result } = await getFriendsList({...req.query})
    res.status(code).send(pack(code, result))
})

// 获取评论列表
router.get('/comment', async (req, res) => {
    const { code, result } = await getCommentList({...req.query})
    res.status(code).send(pack(code, result))
})

// 获取子评论列表
router.get('/comment/children', async (req, res) => {
    const { code, result } = await getChildrenCommentList(req.query.parentCommentId)
    res.status(code).send(pack(code, result))
})

// 添加评论
router.post('/comment', async (req, res) => {
    const { code, result } = await addComment(req.body)
    res.status(code).send(pack(code, result))
})

// 删除评论
router.delete('/comment/:articleId/:commentId/:parentCommentId', async (req, res) => {
    const code  = await delComment({...req.params})
    res.status(code).send(pack(code))
})

module.exports = router;