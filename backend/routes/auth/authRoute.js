const CatchAsync = require('../../services/CatchAsync');
const authController = require('../../controllers/auth/authController');
const { newUserValidater, validateHandler, loginValidater } = require('../../utils/validator');
const authMiddleware = require('../../middleware/authMiddleware');

const router = require('express').Router();

router.route('/login').post(loginValidater(),validateHandler,CatchAsync(authController.loginUser));
router.route('/register').post(newUserValidater(),validateHandler,CatchAsync(authController.registerUser));
router.route('/logout').post(authMiddleware.isAuthenticated, CatchAsync(authController.logout));

module.exports = router;
