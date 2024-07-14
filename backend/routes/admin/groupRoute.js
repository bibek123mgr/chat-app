
const groupController = require('../../controllers/admin/groupController')
const { authMiddleware, restrictTo } = require('../../middleware/authMiddleware')
const { default: Role } = require('../../services/type')
const router = require('express').Router()

router.use(authMiddleware,restrictTo(Role.ADMIN))
router.route('/chats')
    .get(groupController.getAllChats)

module.exports=router