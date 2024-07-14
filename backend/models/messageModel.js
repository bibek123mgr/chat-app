const mongoose = require('mongoose')
const { Schema } = mongoose

const messageSchema = new Schema({
    content: String,
    attachment: {
        type: String,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: true

    },
}, {
    timestamps:true
})

const Message = mongoose.model('Message', messageSchema)
module.exports = Message
