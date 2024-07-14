const nodemailer = require('nodemailer')
const { NODEMAILER_USER, NODEMAILER_PASS } = require('../config/config')

const transporter = nodemailer.createTransport({
    host: 'gmail',
    auth: {
        user: NODEMAILER_USER,
        pass:NODEMAILER_PASS
        
    }
})

const sendMail = async(options) => {
    await transporter.sendMail({
        from: NODEMAILER_USER,
        to: options.to,
        subject: options.subject,
        text:options.massage
    })
}

module.exports=sendMail