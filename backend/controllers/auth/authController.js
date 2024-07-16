const Chat = require('../../models/chatModel.js');
const User = require('../../models/userModel.js');
const AppError = require('../../services/AppError.js');

// Register a new user
const authController = {
    registerUser: async (req, res, next) => {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(new AppError(401, 'User already exists'));
        }
        const user = await User.create({ name, email, password });
        const [friends, groups] = await Promise.all([
           Chat.countDocuments({ members: { $in: [user._id] }, isGroupChat: false }),
           Chat.countDocuments({ members: { $in: [user._id] }, isGroupChat: true })
        ])
        const options = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        };
        const token = user.generateToken();
        const data = {
            _id: user._id,
            name: user.name,
            email: user.email,
            imageurl: user.imageurl,
            role: user.role,
            friends,
            groups
        };
        res.status(201).cookie("token", token, options).json({
            message: 'Successfully register',
            data
           // token
        });
        },
    loginUser: async (req, res, next) => {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select("password email imageurl role");
        if (!user) {
            return next(new AppError(404, 'Invalid credentials'));
        }
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return next(new AppError(404, 'Invalid credentials'));
        }
        const [friends, groups] = await Promise.all([
           Chata.countDocuments({ members: { $in: [user._id] }, isGroupChat: false }),
           Chat.countDocuments({ members: { $in: [user._id] }, isGroupChat: true })
        ])
        const options = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        };
        const token = user.generateToken();
        const data = {
            _id: user._id,
            name: user.name,
            email: user.email,
            imageurl: user.imageurl,
            role: user.role,
            friends,
            groups
        };
        res.status(200).cookie("token", token,options).json({
            message: 'Successfully logged in',
            data,
           token

        });
    },

    logout: async (req, res) => {
        const options = {
            expires: new Date(Date.now())
        };

        res.status(200).cookie("token", null, options).json({
            message: 'Successfully logged out',
        });
    }
};

module.exports = authController;
