const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,'./storage')
    },
    filename: function (req, file, cb) {
        cb(null,Date.now()+'-'+file.originalname)
    },
})

const limits = 5 * 1024 * 1024
 
module.exports={
    storage,
    multer,
    limits
}