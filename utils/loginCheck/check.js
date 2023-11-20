const { accountModel } = require("../../model/userInfo/index")
const { loginVertifyToken } = require("../../utils/token/webAdmin/auth")


async function checkUser(username, getPassword){
    let resObj = {
        code: null,
        message: '',
        result: null
    }
    const has = await accountModel.findOne({ username: username })
    if(has == null){
        resObj.code = 404
        resObj.message = '用户不存在'
    }else{
        const { password } = has
        if(password === getPassword){
            let { _id, token } = has
            resObj.code = 200
            resObj.message = '登陆成功'
            resObj.result = await loginVertifyToken(_id, token)
            await accountModel.updateOne({ _id: _id }, { token: resObj.result })
        }else{
            resObj.code = 404
            resObj.message = '密码错误'
        }
    }
    return resObj
}

module.exports = { checkUser };