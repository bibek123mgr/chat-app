const groupController = require('../../controllers/user/groupController')
const authMiddleware = require('../../middleware/authMiddleware')
const CatchAsync = require('../../services/CatchAsync')
const { Role } = require('../../services/type')


const router = require('express').Router()

router.use(authMiddleware.isAuthenticated,authMiddleware.restrictTo(Role.CUSTOMER))
router.route('/groups')
    .post(CatchAsync(groupController.createGroup))
    .get(CatchAsync(groupController.getMyGroups))
    .patch(CatchAsync(groupController.renameChat))
    .delete(CatchAsync(groupController.deleteGroup))
router.route('/chats')
    .get(CatchAsync(groupController.getMyChats))
router.route('/groups/:id')
    .post(CatchAsync(groupController.addMembers))
    .patch(CatchAsync(groupController.removeMembers))
    .delete(CatchAsync(groupController.deleteGroup))

module.exports=router