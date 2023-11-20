/**
 *  后台web的token操作
 */
const jwt = require('jsonwebtoken')
const { createToken, tokenSecret } = require('../jwt')
// 登录校验token
const loginVertifyToken = ( userId, token) => {
    let flag = false
    let newToken = null
    if(!token){
        newToken = createToken(userId)
    }else {
        jwt.verify(token, tokenSecret, (err, data) => {
            if(err){
                newToken = createToken(userId)
                flag = false
            }
            flag = true
        })
    }
    return flag ? token : newToken
}

module.exports = { loginVertifyToken }