const User = require("../../models/userModel");
const AppError = require("../../services/AppError");

const userController = {
    getUsers: async (req, res, next) => {
        const { name,page = 1,limit = 20 } = req.params;
        const skip = (page - 1) * limit
        const query = {};
        if (name) {
            query.name = { $regex: name, $options: 'i' };
        }
        const [user,userCount] = await Promise.all([
            User.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            User.countDocuments()
        ])

        const totalPages = Math.ceil(userCount / limit) || 0

        res.status(200).json({
            message: 'fetch',
            data: {
                user,
                totalUser: userCount,
                totalPages
            }
       })
        
    },
    deleteUser: async (req, res, next) => {
        const {id} = req.params;
        const user = await User.findByIdAndDelete(id)
            if (!user) {
            return next(new AppError(404,'no userFound'))
        }
        res.status(200).json({
            message: 'user deleted successfully',
       })
        
    }
}

module.exports=userController