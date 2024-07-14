const userController = require('../../controllers/admin/userController')
const { authMiddleware, restrictTo } = require('../../middleware/authMiddleware')
const { default: Role } = require('../../services/type')
const router = require('express').Router()

router.use(authMiddleware,restrictTo(Role.ADMIN))
router.route('/costumers')
    .get(userController.getUsers)
    .delete(userController.deleteUser)

module.exports=router