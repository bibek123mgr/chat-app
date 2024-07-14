const messageController = require('../../controllers/user/messageController')
const authMiddleware = require('../../middleware/authMiddleware')
const CatchAsync = require('../../services/CatchAsync')
const { Role } = require('../../services/type')
const { sendGetMessageValidator, validateHandler, deleteMessageValidator } = require('../../utils/validator')
const router = require('express').Router()

router.use(authMiddleware.isAuthenticated,authMiddleware.restrictTo(Role.CUSTOMER))
router.route('/messages/:id')
    .post(sendGetMessageValidator(),validateHandler,CatchAsync(messageController.sendMessage))
    .get(sendGetMessageValidator(),validateHandler,CatchAsync(messageController.getMessages))
    .delete(deleteMessageValidator(),validateHandler,CatchAsync(messageController.deleteMessages))

module.exports=router