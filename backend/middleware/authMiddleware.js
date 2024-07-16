const AppError = require("../services/AppError.js")
const promisify = require('util').promisify
const jwt=require('jsonwebtoken')
const User = require("../models/userModel.js")
const { JWT_SECRET } = require("../config/config.js")
const authMiddleware = {
isAuthenticated: async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return next(new AppError(400, 'Please log in'));
        }
        const decodedPayload = await promisify(jwt.verify)(token, JWT_SECRET);
        const user = await User.findById(decodedPayload.id);

        if (!user) {
            return next(new AppError(404, 'User not found'));
        }
        req.user = decodedPayload.id;
        next();
    } catch (error) {
        return next(new AppError(500, 'Internal server error'));
    }
},
restrictTo : (...roles) => {
    return async (req,res,next)=>{
        const user = await User.findById(req.user)
        let userRole = user.role
        if (!roles.includes(userRole)) {
            return next(new AppError(403,'foebidden for this.action'))
        }
        next()
    }
    },
    isAuthSocket : async (socket, next) => {
  try {
    const token = socket.request.cookies.token;
    if (!token) {
      return next(new AppError(401, 'Authentication token missing'));
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return next(new AppError(401, 'Invalid token'));
      }
      socket.request.user = decoded;
      next();
    });
  } catch (err) {
    return next(new AppError(500, 'Internal server error'));
  }
}
}
module.exports=authMiddleware