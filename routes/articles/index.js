var express = require('express');
var router = express.Router();
const utils = require('./utils/index')
const { pack } = require('../../utils/index');
const http_code = require('../../utils/code');
const { articleModel } = require('../../model/articles');

/* GET home page. */
// 获取文章预览列表
router.get('/list', async (req, res) => {
    let searchRes = await utils.searchArticleList({ ...req.query })
    res.status(searchRes.code).send(pack(searchRes.code, { total: searchRes.total, list: searchRes.list }))
});

// 获取文章的markdown
router.get('/', async(req, res) => {
    let content = await utils.getContent(req.query.articleId)
    if(typeof content === 'number'){
        res.status(http_code.error).send(pack(http_code.error, false))
    }else{
        res.status(http_code.success).send(pack(http_code.success, content))
    }
})


// 添加文章
router.post('/', async (req, res) => {
    let code = await utils.addArticle({...req.body})
    res.status(code).send(pack(code))
})

// 更新文章
router.put('/', async (req, res) => {
    let body = req.body
    let articleId = body.articleId
    let code = await utils.updateArticle({ articleId: articleId, updatedArticle: body })
    res.status(code).send(pack(code))
})

// 删除文章
router.delete('/:articleId/:tagId', async(req, res) => {
    let { articleId, tagId } = req.params
    let code = await utils.delArticle(articleId, tagId)
    res.status(code).send(pack(code))
})
module.exports = router;