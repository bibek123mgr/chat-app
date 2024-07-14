const mongoose = require('mongoose')
const { Schema } = mongoose

const chatSchema = new Schema({
    name: {
        type: String,
    },
    isGroupChat: {
        type: Boolean,
        default:false
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    members:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    avatar: {
        type: String,
        default:'https://png.pngtree.com/png-clipart/20191121/original/pngtree-group-icon-png-image_5097424.jpg'
    }
}, {
    timestamps:true
})

const Chat = mongoose.model('Chat', chatSchema)
module.exports = Chat
