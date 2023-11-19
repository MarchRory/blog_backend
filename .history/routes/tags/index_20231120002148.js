var express = require('express');
var router = express.Router();
const { search, addTag, delTag, updateTag } = require('./utils/index')
const { pack } = require('../../utils/index')

/* GET home page. */
router.get('/taglist', async (req, res) => {
  const { keywords, pageNum, pageSize } = req.query
  const userId = req.headers['is-front'] ? null : req.auth.userId
  const resultModel = await search(userId, keywords, pageNum, pageSize)
  const { code, result } = resultModel
  res.status(code).send(pack(code, { ...result }))
});

router.post('/tag', async (req, res) => {
  const { userId } = req.auth
  const { tagname, tagIcon, publishTime } = req.body
  const code = await addTag(userId, tagname, tagIcon, publishTime)
  res.status(code).send(pack(code, null))
})

router.delete('/tag/:tagId', async (req, res) => {
  const { userId } = req.auth
  const { tagId } = req.params
  let result = await delTag(userId, tagId)
  res.status(200).send(pack(200, `${result?'success':'fault'}`, `${result?'专栏移除成功':'该专栏与较多笔记绑定, 当前不能移除'}`))
})

router.put('/tag', async (req, res) => {
  const { userId } = req.auth
  const { tagId, tagname, tagIcon, updateTime } = req.body
  let code = await updateTag(userId, tagId, tagname, tagIcon, updateTime)
  res.status(code).send(pack(code, '数据更新成功'))
})

module.exports = router;