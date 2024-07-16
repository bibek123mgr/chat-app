const { WEBSITE_URL } = require("../../config/config")
const { getMembers } = require("../../lib/helper")
const Chat = require("../../models/chatModel")
const Message = require("../../models/messageModel")
const AppError = require("../../services/AppError")
const fs=require('fs').promises

const messageController={
    sendMessage: async (content, id, sender) => {
    try {
        let message = await Message.create({
            content,
            chat: id,
            sender
        });
        message = await Message.findById(message._id).populate("sender", "name imageurl");
        const data = {
            _id: message._id,
            sender: message.sender,
            chat: message.chat,
            content: message.content,
            createdAt: message.createdAt
        };

        return data
    } catch (err) {
        console.error("Error sending message:", err);
        throw new Error("Failed to send message");
    }
},
    getMessages: async (req, res, next) => {
        const {id}=req.params
        const { page = 1 } = req.query
        const limit = 20;
        const skip = (page - 1) * limit
        const [chat, message, totalMessage] = await Promise.all([
            Chat.findById(id),
            Message.find({ chat: id })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit).
                select(["-updatedAt" ,"-__v"])
                .populate('sender', 'name imageurl')
                .lean(),
            Message.countDocuments({ chat: id })
        ])
        if (!chat || !chat.members.includes(req.user)) {
            return next(new AppError(401,'can\'t perform this action'))
        }

        const totalPages = Math.ceil(totalMessage / limit) || 0
        
        res.status(200).json({
            message: 'successfully fetch',
            data: {
                message: message.reverse(),
                totalMessage,
                totalPages
            }
            
        })
    },
    deleteMessages: async (req, res, next) => {
        const {id} = req.params   
        const message = await Message.findOneAndDelete({ _id: id,sender:req.user })
        if (!message) {
            return next(new AppError(401,'can\'t perform this action'))
        }        
        res.status(200).json({
            message: 'delete message'            
        })
    }

}
module.exports=messageController
