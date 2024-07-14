const Chat = require("../../models/chatModel");

const groupController = {
getAllChats: async (req, res, next) => {
    const { name, page = 1, limit = 20, isGroupChat } = req.params;
    const skip = (page - 1) * limit;
    const query = {};

    if (name) {
        query.name = { $regex: name, $options: 'i' };
    }

    if (isGroupChat) {
        query.isGroupChat = isGroup === 'true'; // Assuming isGroup is passed as a string
    }

    const [chats, chatCount] = await Promise.all([
        Chat.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Chat.countDocuments(query) // Count documents matching the query
    ]);
        
    const totalPages = Math.ceil(chatCount / limit) || 0;
    
    res.status(200).json({
        message: 'fetch',
        data: {
            chats,
            totalGroups: chatCount,
            totalPages
        }
    });
}

}
module.exports=groupController