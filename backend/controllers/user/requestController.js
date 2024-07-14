const { NEW_REQUEST, ALERT, REFETCH_CHATS } = require("../../constants/events.js")
const Chat = require("../../models/chatModel.js")
const Request = require("../../models/requestModel.js")
const AppError = require("../../services/AppError.js")
const { emitEvent } = require("../../utils/features.js")

const requestController = {
    sendRequest: async (req, res, next) => {
        const { userId } = req.body
        const request = await Request.findOne({
                $or: [
                    { sender: req.user, reciver: userId },
                    { sender: userId, reciver: req.user },   
                ]
             })
        if (request && request.status == 'pending') {
            return next (new AppError(401,'can perform'))
        }

        if (request && request.status == 'accepted') {
            return next(new AppError(400,'you are already friend'))
        }
            await Request.create({
                sender: req.user,
                reciver:userId
            })

        emitEvent(req, NEW_REQUEST, [userId])
        
        res.status(201).json({
            message:'successfully send Request'
        })
    },
    changeRequestStatus: async (req, res, next) => {
        const { requestId, status } = req.body
        const request = await Request.findById(requestId)

        if (!request || request.reciver.toString() !== req.user.toString()) {
            return next(new AppError(403, 'No Request or Forbidden. This action'));
        }
        if (status === 'rejected') {
            await request.deleteOne()
        }
        else{
            const members = [req.user,request.sender]
            await Promise.all([
                Chat.create({
                members
            }),
            request.deleteOne()
            ])
            emitEvent(req,
            REFETCH_CHATS,
            members
        )
        }
        // emitEvent(req,
        //     ALERT,
        //     `request has been ${status}`,
        //     R
        // )
        res.status(200).json({
            message:`request has been ${status}`
        })

    },
    getAllRequest: async (req, res, next) => {
        const request = await Request.find({
            reciver: req.user
        }).select("status sender reciver createdAt").populate('sender', 'name imageurl');

        res.status(200).json({
            message: 'fetch successfully',
            data:request
        })
    }
}

module.exports=requestController