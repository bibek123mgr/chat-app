const Chat = require("../../models/chatModel")
const Message = require("../../models/messageModel")
const User = require("../../models/userModel")
const { Role } = require("../../services/type")

const dataService = async(req,res,next) => {
    const [users, chats, messages,groups,admins,requests] = await Promise.all([
        User.countDocuments({role:Role.CUSTOMER}),
        Chat.countDocuments(),
        Message.countDocuments(),
        Chat.countDocuments({ isGroupChat: true }),
        User.countDocuments({ role: Role.ADMIN }),
        Request.countDocuments()

    ])

    return res.status(200).json({
        message: 'successfully fetch',
        data: {
            admins,
            users,
            groups,
            chats,
            messages,
            requests
        }
    })
}

module.exports=dataService