const mongoose = require("../DB")
var Schema = mongoose.Schema

// 文章预览卡片的Schema
var articleSchema = new Schema({
    articleId: {
        type: mongoose.Schema.Types.ObjectId,                // 文章id,
        required: true,
        unique: true
    },
    tagId: String,                                           // 被收录到的专栏Id
    summary: String,                                         // 摘要
    cover: String,                                           // 封面
    publishTime: Date,                                       // 文章发布日期
    updateTime: {                                            // 上次更新时间
        type: Date,
        default: 0
    },                                        
    title: String,                                           // 文章标题
    views: Number,                                           // 阅读次数
    content: Buffer,                                         // 文章内容
    commentCnt: Number,                                      // 文章评论数
})

const articleModel = mongoose.model('articles', articleSchema)

module.exports = { articleModel }