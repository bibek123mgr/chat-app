const dotenv = require('dotenv');
dotenv.config();

const {
    PORT,
    BCRYPT_SALT,
    JWT_SECRET,
    WEBSITE_URL,
    NODEMAILER_PASS,
    NODEMAILER_USER,
    MONGO_URI,
    ADMIN_NAME,
ADMIN_EMAIL,
ADMIN_ROLE,
    ADMIN_PASS,
ENVIRONMENT
} = process.env;

module.exports = {
    PORT,
    BCRYPT_SALT,
    JWT_SECRET,
    WEBSITE_URL,
    NODEMAILER_PASS,
    NODEMAILER_USER,
    MONGO_URI, ADMIN_NAME,
ADMIN_EMAIL,
ADMIN_ROLE,
    ADMIN_PASS,
ENVIRONMENT
};
