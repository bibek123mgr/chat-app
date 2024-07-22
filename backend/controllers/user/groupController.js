const { rename } = require("fs")
const { WEBSITE_URL } = require("../../config/config")
const { ALERT, REFETCH_CHATS, MESSAGE_ALERT } = require("../../constants/events")
const { getOtherMember } = require("../../lib/helper")
const Chat = require("../../models/chatModel")
const Message = require("../../models/messageModel")
const User = require("../../models/userModel")
const AppError = require("../../services/AppError")
const { emitEvent } = require("../../utils/features")
const fs = require('fs').promises;

const groupController = {
    createGroup: async (req, res, next) => {
        console.log(req.body)
        const { name, members } = req.body
        if (!name || !members) {
            return next(new AppError(400, 'require name and member '))
        }
        const allMembers = [...members, req.user]
        const group=await Chat.create({
            name,
            isGroupChat: true,
            creator: req.user,
            members: allMembers,
        })
        const data = {
            _id: group._id,
            name:group.name,
            isGroupChat: group.isGroupChat,
            creator: req.user,
            members: group.members,
        }
        res.status(201).json({
            message: 'group created',
            data:data
        })
    },
    getMyGroups: async (req, res, next)=>{
        const chats = await Chat.find({
            members:{$in:req.user},
            isGroupChat: true,
        }).select("isGroupChat name avater members creator createdAt").populate('members', 'name avater imageurl')
        res.status(200).json({
            message: 'Chats retrieved successfully',
            data: chats
        });
    },
    deleteGroup: async (req, res, next) => {
          const { chatId } = req.body;
          const chat = await Chat.findById(chatId);

          if (!chat) {
              return next(new AppError(404, 'Chat not found'));
          }

          if (!chat.isGroupChat && chat.creator.toString() !== req.user.toString()) {
              return next(new AppError(403, 'Forbidden for this action'));
          }
          const messages = await Message.find({ chat: chatId });
          await Promise.all(messages.map(async (message) => {
              if (message.attachment) {
                  const attachmentUrl = message.attachment.slice(WEBSITE_URL.length);
                  try {
                      await fs.unlink(`./storage/${attachmentUrl}`);
                  } catch (err) {
                      console.error(`Failed to delete attachment: ${err}`);
                  }
              }
          }));
          await Promise.all([
              Message.deleteMany({ chat: chatId }),
              chat.deleteOne()
          ]);

          res.status(200).json({ message: 'Group chat deleted successfully' });
    },
    renameChat: async (req, res, next) => {
    const { name, chatId } = req.body;
    const chat = await Chat.findById(chatId);
    if (!chat) {
        return next(new AppError(404, 'Chat not found'));
    }
    if (!chat.isGroupChat || chat.creator.toString() !== req.user.toString()) {
        return next(new AppError(403, 'Forbidden for this action'));
    }
    chat.name = name;
    await chat.save();
    emitEvent(req, MESSAGE_ALERT, chat.members, `Group name has changed to ${name}.`);

    res.status(200).json({
        message: 'Group name has been changed successfully',
    });
    },
    getMyChats: async (req, res, next) => {
    const chats = await Chat.find({ members: req.user });
    const transformChats = await Promise.all(chats.map(async chat => {
        const otherMemberId = getOtherMember(chat.members, req.user);
        const otherMember = await User.findById(otherMemberId); 
        return {
            _id: chat._id,
            isGroupChat: chat.isGroupChat,
            imageurl: chat.isGroupChat ? chat.avatar : otherMember.imageurl,
            name: chat.isGroupChat ? chat.name : otherMember.name,
            members:chat.isGroupChat ? [otherMemberId] : otherMember._id
        };
    }))
    res.status(200).json({
        message: 'Chats retrieved successfully',
        data: transformChats || []
    });
    },
    addMembers: async (req, res, next) => {
    const { id } = req.params;
    const { members } = req.body;
    const chat = await Chat.findById(id);

    if (!chat) {
        return next(new AppError(404, 'Chat not found'));
    }
    if (!chat.isGroupChat || chat.creator.toString() !== req.user.toString()) {
        return next(new AppError(403, 'Forbidden for this action'));
    }
    const allNewMembersPromise = members.map((member) => User.findById(member, "name"));
    const allNewMembers = await Promise.all(allNewMembersPromise);
    const uniqueNewMembers = allNewMembers.filter((member) => !chat.members.includes(member._id.toString()));
    chat.members.push(...uniqueNewMembers.map((member) => member._id));
    if (chat.members.length > 100) {
        return next(new AppError(403, 'Member limit exceeded (maximum 100 members).'));
    }
    await chat.save();
    const allUserNames = uniqueNewMembers.map((member) => member.name).join(", ");
    emitEvent(req, ALERT, chat.members, `${allUserNames} added to the group.`);
    emitEvent(req, REFETCH_CHATS, chat.members);
    return res.status(200).json({
        message: 'Members added successfully.',
    });
    },
    removeMembers: async (req, res, next) => {
        const { userId } = req.body
        const {id}=req.params
        const [chat, user] = await Promise.all([
            Chat.findById(id),
            User.findById(userId,'name')
        ])

        if (!chat || !user) {
           return next(new AppError(400,'please provide credentials'))  
        }

        // if (chat.members.length <= 3) {
        //      return next(new AppError(400,'Group have aleast 3 members'))            
        // }

        chat.members=chat.members.filter((member) => member.toString() !== userId.toString())
        await chat.save()
        emitEvent(req,
            ALERT,
            chat.members,
            `${user.name} has been removed.`
        )

        emitEvent(req,
            REFETCH_CHATS,
            chat.members
        )
        res.status(200).json({
            message:'member removed'
        })
    },
    leaveGroup: async (req, res, next) => {
        const { id } = req.params
        const [chat, user] = await Promise.all([
            Chat.findOn({_id:id,isGroupChat:true}),
            User.findById(req.user,'name')
        ])

        if (!chat || !user) {
           return next(new AppError(400,'please vlid provide credentials'))  
        }
        if (!chat.members.includes(req.user)) {
        return next(new AppError(401,'you are not in group'))         
        }
        chat.members = chat.members.filter((member) => member.toString() !== req.user.toString())
        
        
        if (chat.creator.toString === req.user.toString) {
            if (chat.members.length > 0) {
            let randomNumber
                do {
                    randomNumber = Math.floor(Math.random() * chat.members.length)
                }while(chat.members < 0)
                const newCreator = chat.members[randomNumber]
                chat.creator = newCreator
            } else {
                await Promise.all([
                 chat.deleteOne(),
                 Message.deleteMany()
                ])
            }
        }
        await chat.save()
       
         emitEvent(req,
            ALERT,
            chat.members,
            `${user.name} has left this group.`
        )

        res.status(200).json({
            message:'member left'
        })

    },

    
}

module.exports=groupController