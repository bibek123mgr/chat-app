const userController = require('../../controllers/user/userController.js')
const authMiddleware = require('../../middleware/authMiddleware.js')
const CatchAsync = require('../../services/CatchAsync.js')
const { Role } = require('../../services/type.js')

const router = require('express').Router()

router.use(authMiddleware.isAuthenticated,authMiddleware.restrictTo(Role.CUSTOMER))
router.route('/profile')
    .get(CatchAsync(userController.getMyProfile))
    .delete(CatchAsync(userController.deleteMyAccount))
    .patch(CatchAsync(userController.editProfile))
    .post(CatchAsync(userController.changePassword))
router.route('/friends')
    .get(CatchAsync(userController.getMyFriends))
    .patch(CatchAsync(userController.unfriend))
router.route('/users')
    .get(CatchAsync(userController.findUser))

module.exports=router