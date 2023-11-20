const mongoose = require("../DB")
var Schema = mongoose.Schema

var tagSchema = new Schema({
    tagId: {
        type: mongoose.Schema.Types.ObjectId, 
        unique: true
    },
    publishTime: Date,
    updateTime: Date,
    userId: String,
    tagname: String,
    tagIcon: String,
    hasNums: Number
})


const tagModel = mongoose.model('tags', tagSchema)

module.exports = { tagModel }