var express = require('express');
var router = express.Router();
const utils = require('./utils/index')
const http_code = require("../../utils/code")
const { pack } = require('../../utils/index')

/* GET home page. */
router.get('/', async (req, res) => {
    const userId = req.auth.userId 
    const { keywords, pageNum, pageSize } = req.query
    let searchRes = await utils.searchFriends(userId, keywords, pageNum, pageSize)
    const { code, list, total } = searchRes
    res.status(code).send(pack(code, { list, total }))
});

router.post('/', async (req, res) => {
    let code = await utils.addFriend({...req.body})
    res.status(code).send(pack(code, true))
} )

router.put('/', async (req, res) => {
    let code = await utils.updateFriend({...req.body})
    res.status(code).send(pack(code, true))
})

router.delete('/:friendId', async (req, res) => {
    const { friendId } = req.params
    let code = await utils.delFri(friendId)
    res.status(code).send(pack(code, `${code == http_code.success ? '友链移除成功' : ''}`))
})

module.exports = router;