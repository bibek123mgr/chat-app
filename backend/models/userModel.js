const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { BCRYPT_SALT, JWT_SECRET } = require('../config/config');

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true 
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    imageurl: {
        type: String,
        default: 'https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTAxL3JtNjA5LXNvbGlkaWNvbi13LTAwMi1wLnBuZw.png'
    },
    role: {
        type: String,
        default: 'customer',
        enum: ['admin', 'customer']
    }
}, {
    timestamps: true
});

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, Number(BCRYPT_SALT));
    }
    next();
});


userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = function () {
    return jwt.sign({ id: this.id }, JWT_SECRET, {
        expiresIn: '7d'
    });
};

const User = mongoose.model('User', userSchema);
module.exports = User;
