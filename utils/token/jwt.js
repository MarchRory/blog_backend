const jwt = require("jsonwebtoken")
const tokenSecret = 'liushiToken'
const { accountModel } = require('../../model/userInfo/index')
// 创建token - sign 方法
const createToken = (userId) => {
    return 'Bearer ' + jwt.sign({
        userId: userId
    }, tokenSecret, {
        expiresIn: 3600 * 24 * 7
    })
}

// 解析token
const analysisToken = (token) => {
    let res
    jwt.verify(token, tokenSecret, (err, data) => {
        if(err){
            console.log(err)
            return new Error(err)
        }
        console.log(data)
        return res = data
    })
    return res
}

const delToken = async ( userId ) => {
    await accountModel.updateOne({ _id: userId }, { token: '' })
}

const isRevoked = async (req, token) => {
    console.log(req.headers)
    let flag = await req.headers['is-front']
    if(flag){
        return false
    }
    return true
}

module.exports = { createToken, analysisToken, tokenSecret, delToken, isRevoked }