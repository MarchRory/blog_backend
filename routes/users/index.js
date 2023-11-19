var express = require('express');
var router = express.Router();
const { checkUser } = require('../../utils/loginCheck/check')
const { analysisToken, delToken } = require('../../utils/token/jwt')
const { searchUser, createContact, updateBaseInfo, searchContact } = require('./utils/index')
const { pack } = require('../../utils/index');
const { contactModel } = require('../../model/userInfo');


/* GET users listing. */
router.post('/login', async (req, res) => {
  const { username, password } = req.body
  const checkRes = await checkUser(username, password)
  const { code } = checkRes
  res.status(code).json(checkRes)
})

router.get('/logout', async(req, res) => {
  const tokenInfo = req.auth
  const { userId } = tokenInfo
  await delToken(userId)
  res.status(200).json(pack(200, 'logout success'))
})


router.get('/getUserInfo', async(req, res) => {
  const { userId } = req.auth
  const { code, result } = await searchUser(userId)
  res.status(code).json(pack(code, result))
})

router.put('/baseInfo', async (req, res) => {
  const { userId } = req.auth
  const code = await updateBaseInfo(userId, { ...req.body })
  res.status(code).send(pack(code))
})

router.post('/contact', async (req, res) => {
  const { userId } = req.auth
  const code = await updateContact(userId, req.body)
  res.status(code).send(pack(code))
})

router.get('/contact', async (req, res) => {
  const { userId } = req.auth
  const contact = await searchContact(userId)
  res.status(200).send((pack(200, contact)))
})

module.exports = router;
