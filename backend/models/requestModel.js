const mongoose = require('mongoose')
const { Schema } = mongoose

const requestSchema = new Schema({
    status: {
        type: String,
        default: 'pending',
        enum:['pending','accepted','rejected']
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    reciver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
}, {
    timestamps:true
})

const Request = mongoose.model('Request', requestSchema)
module.exports = Request
