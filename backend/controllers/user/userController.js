const { WEBSITE_URL } = require("../../config/config.js")
const {getOtherMember}=require('../../lib/helper.js')
const Chat = require("../../models/chatModel.js")
const Message = require("../../models/messageModel.js")
const Request = require("../../models/requestModel.js")
const User = require("../../models/userModel.js")
const AppError = require("../../services/AppError.js")
const fs=require("fs")

const userController = {
getMyFriends: async (req, res, next) => {
    const chats = await Chat.find({ members: { $in: [req.user] } }).exec();
    const friends = chats.flatMap(chat => chat.members.filter(member => !member.equals(req.user)));

    const friendIds = friends.map(friend => friend._id);
    const query = { _id: { $in: friendIds } };

    const myFriends = await User.find(query)
        .select('name imageurl')
        .exec();

    return res.status(200).json({
        message: 'Fetched successfully',
        data: myFriends,
    });
}
,
    findUser : async (req, res, next) => {
     const { name = '', limit = 10, page = 1 } = req.query; 
     const skip = (page - 1) * limit
        const chats = await Chat.find({ members: { $in: [req.user] } }).exec();
     const friends = chats.map(chat => getOtherMember(chat.members, req.user));
     friends.push(req.user.toString());
     
        const queryCriteria = {
            _id: { $nin: friends } 
        };

        if (name) {
            queryCriteria.name = { $regex: name, $options: 'i' };
        }
        const remainingUsers = await User.find(queryCriteria)
            .select('name imageurl')
            .limit(Number(limit))
            .skip(Number(skip))
            .exec();
        const totalPages = Math.ceil(remainingUsers.length / limit) || 0;
        return res.status(200).json({
         message:'fetch successfully',
         data: remainingUsers,
         totalPages
     });
    },
    unfriend: async (req, res, next) => {
        const { userId } = req.body;
        console.log(userId)
         const [chat, messages] = await Promise.all([
            Chat.findOne({isGroupChat: false ,members:{$in:[req.user,userId]}}),
            Message.find({ chat: id })
        ]);

        if (!chat) {
            return next(new AppError(400, 'You are not a friend'));
        }

        messages.forEach(({ attachment }) => {
            if (attachment) {
                const attachmentUrl = attachment.slice(WEBSITE_URL.length);
                fs.unlink(`./storage/${attachmentUrl}`, err => {
                    if (err) console.error(`Error deleting file: ${attachmentUrl}`, err);
                });
            }
        });

        await chat.deleteOne();
        // await Message.deleteMany({ chat: id });

        res.status(200).json({
            message: 'Successfully unfriended'
        });
        
    },
    editProfile: async (req, res, next) => {
        const { name, email } = req.body
        let fileName;
        if (req.file) {
            fileName = WEBSITE_URL + req.file.filename;
        }
        const user = await User.findByIdAndUpdate(req.user, {
            name,
            email,
            imageurl:fileName
        }, { new: true }).select("name email imageurl role createdAt")
        res.status(200).json({
            message: 'profile updated successfully',
            data:user
    })
    },
    deleteMyAccount: async (req, res, next) => {
    const { password } = req.body;
    const [user, chats,chatts] = await Promise.all([
        User.findById(req.user).select("password"),
        Chat.find({ members: { $in: [req.user] }, isGroupChat: true }),
        Chat.find({ members: { $in: [req.user] }, isGroupChat: false }),
    ]);
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        return next(new AppError(404, 'Enter valid credentials'));
    }
    for (let chat of chats) {
        chat.members = chat.members.filter(member => member.toString() !== req.user.toString());
        if (chat.creator.toString() === req.user.toString()) {
            if (chat.members.length > 0) {
                let newCreatorIndex;
                do {
                    newCreatorIndex = Math.floor(Math.random() * chat.members.length);
                } while (newCreatorIndex < 0);
                chat.creator = chat.members[newCreatorIndex];
            } else {
                await Chat.deleteOne({ _id: chat._id });
                await Message.deleteMany({chat:chat._id})
                continue;
            }
        }
        await chat.save();
    }
        
    for (let chat of chatts) {
        chat.members = chat.members.filter(member => member.toString() !== req.user.toString())
        if (chat.members.length < 0) {
            await Chat.deleteOne({ _id: chat._id });
            await Message.deleteMany({chat:chat._id}) 
        }
   }
    await user.deleteOne();
    const options = {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: true
    };

    res.status(200).cookie("token", null, options).json({
        message: 'Successfully account deleted'
    });
    },
    getMyProfile: async (req, res, next) => {
        const [user, friends, groups] = await Promise.all([
            User.findById(req.user),
           Chat.countDocuments({ members: { $in: [req.user] }, isGroupChat: false }),
           Chat.countDocuments({ members: { $in: [req.user] }, isGroupChat: true })
        ])

        const data = {
            _id: user._id,
            name: user.name,
            email: user.email,
            imageurl: user.imageurl,
            createdAt: user.createdAt,
            role: user.role,
            friends,
            groups
        }

        res.status(200).json({
            message: 'fetch profile',
            data
        })
    },
    changePassword: async (req, res, next) => {
        const { password,newPassword } = req.body
        const user = await User.findById(req.user).select("password")
        const isMatch = await user.matchPassword(password)
        if (!isMatch) {
        return next(new AppError(404,'enter valid credentails'))
        }
        user.password = newPassword;
        await user.save()
    const options = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure:true
            }
    const token = user.generateToken();
    res.status(200).cookie("token", token,options).json({
        message: 'password changed',
    });
    }
}

module.exports=userController