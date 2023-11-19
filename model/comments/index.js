const mongoose = require("../DB")
var Schema = mongoose.Schema

var commentsSchema = new Schema({
    articleId:  String,                                       // 文章id
    commentId: {
        type: mongoose.Schema.Types.ObjectId,                 // 该条评论id
        required: true,
        unique: true
    },
    floorId: String,                                           // 该条评论所属的楼主评论Id
    floorOwnerEmail: String,                                   // 该条评论所在楼层的楼主邮箱
    qqEmail: String,                                           // 评论者邮箱,
    avatar: String,                                            // 评论者头像
    nickname: String,                                          // 评论者昵称
    content: String,                                           // 评论内容
    childCommentCnt: Number,                                   // 子评论数
    identity: Number,                                          // 评论者身份: 1 - 博主, 0 - 层主, -1 - 楼层中普通用户
    time: Date,                                                // 评论时间
    reviewedEmail: String,                                     // 被评论者邮箱
    reviewedNickname: String                                   // 被评论者昵称
})

var childrenCommentSchema = new Schema({
    articleId:  String,                                       // 文章id
    commentId: {
        type: mongoose.Schema.Types.ObjectId,                 // 该条评论id
        required: true,
        unique: true
    },
    floorId: String,                                           // 该条评论所属的楼层评论Id
    floorOwnerEmail: String,                                   // 该条评论所在楼层的楼主邮箱
    qqEmail: String,                                           // 评论者邮箱,
    avatar: String,                                            // 评论者头像
    nickname: String,                                          // 评论者昵称
    content: String,                                           // 评论内容
    childCommentCnt: Number,                                   // 子评论数
    identity: Number,                                          // 评论者身份: 1 - 博主, 0 - 层主, -1 - 楼层中普通用户
    time: Date,                                                // 评论时间
    reviewedCommentId: String,                                     // 被评论的评论id
    reviewedEmail: String,                                     // 被评论者邮箱
    reviewedNickname: String                                   // 被评论者昵称
})

const commentsModel = mongoose.model('comments', commentsSchema)
const childrenCommentsModel = mongoose.model('childrenComments', childrenCommentSchema)

module.exports = { commentsModel, childrenCommentsModel }