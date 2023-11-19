const mongoose = require("mongoose")
const DB_URL = 'mongodb://localhost:27017/'
const DB_NAME = 'blog_admin'
mongoose.connect(DB_URL+DB_NAME, {useUnifiedTopology:true,useNewUrlParser: true})
.then(res => {
    console.log('数据库连接成功')
}).catch (err => {
    console.log('数据库连接失败: ', err)
 })
// 暴露连接对象
module.exports = mongoose