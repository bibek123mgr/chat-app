const requestController = require('../../controllers/user/requestController')
const authMiddleware = require('../../middleware/authMiddleware')
const CatchAsync = require('../../services/CatchAsync')
const { Role } = require('../../services/type')

const router = require('express').Router()

router.use(authMiddleware.isAuthenticated,authMiddleware.restrictTo(Role.CUSTOMER))
router.route('/requests')
    .get(CatchAsync(requestController.getAllRequest))
    .patch(CatchAsync(requestController.changeRequestStatus))
    .post(CatchAsync(requestController.sendRequest))

module.exports=router