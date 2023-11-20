const http_code = require("./code")
/**
 * 统一打包处理结果, 使其符合前端的ts类型定义
 * @param {Number} code 状态码
 * @param {String} msg 信息
 * @param {*} data 处理后的数据
 * @returns 
 */
const pack = (code, data) => {
    let msg = ''
    if(code === http_code.success){
        msg = 'success'
    }else if(code === http_code.not_found){
        msg = '没有相关数据'
    }else if(code === http_code.error){
        msg = '服务器异常, 操作失败'
    }else if (code === http_code.token_invalid) {
        msg = '本次登录过期, 请重新登录'
    }
    return {
        code: code,
        message: msg,
        result: data
    }
}

module.exports = { pack };