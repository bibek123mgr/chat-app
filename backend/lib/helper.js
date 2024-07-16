const Chat = require("../models/chatModel")

const getOtherMember = (members, userId) => 
     members.find((member) => member._id.toString() !== userId.toString())
const getMembers = async (id) => { 
     let data = await Chat.findById(id).select(["members"])
     return  data.members
}
     


module.exports={getOtherMember,getMembers}