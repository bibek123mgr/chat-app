const { body, validationResult, param } = require('express-validator');
const AppError = require('../services/AppError');

const validateHandler = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const uniqueErrors = new Set(errors.array().map(error => error.msg));
        const errorMessages = [...uniqueErrors].join(', ');
        return res.status(400).json({
            message:errorMessages
        })    }

        next();
};

const newUserValidater = () => [
    body('name', "Name is required").notEmpty(),
    body('email')
        .notEmpty().withMessage('email is required')
        .isEmail().withMessage('invalid email form')
        .trim(),
    body('password', "Password is required").notEmpty().trim()
];

const loginValidater = () => [
    body('email')
        .notEmpty().withMessage('email is required')
        .isEmail().withMessage('invalid email form')
        .trim(),
    body('password', "Password is required").notEmpty().trim()
];

const createChatValidater = () => [
    body('name', "Name is required").notEmpty(),
    body('members')
        .notEmpty()
        .isArray({ min: 2, max: 99 })
        .withMessage('Members should be an array with at least 2 and no more than 99 elements')
];

const deleteChatValidater = () => [
    param('id', "Please provide ID").notEmpty()
];

const addMembersInChatValidator = () => [
    body('chatId', "Chat ID is required").notEmpty(),
    body('members')
        .notEmpty()
        .isArray({ min: 1, max: 97 })
        .withMessage('Members should be an array with at least 1 and no more than 97 elements')
];

const removeMembersInChatValidator = () => [
    body('chatId', "Chat ID is required").notEmpty(),
    body('userId', "User ID is required").notEmpty()
];

const sendGetMessageValidator = () => [
    param('id', "Chat ID is required").notEmpty(),
];

const deleteMessageValidator = () => [
    param('id', "messageId is required").notEmpty(),

];


const changeRequestStatusValidator = () => [
    body('userId', "User ID is required").notEmpty(),
    body('status', "Status is required")
        .notEmpty()
        .isIn(['accepted', 'rejected'])
        .withMessage('Status must be either accepted or rejected')
];

const sendRequestValidator = () => [
    body('userId', "User ID is required").notEmpty()
];

module.exports = {
    newUserValidater,
    loginValidater,
sendGetMessageValidator,
    deleteChatValidater,
    validateHandler,
    createChatValidater,
    deleteMessageValidator,
    addMembersInChatValidator,
    removeMembersInChatValidator,
    changeRequestStatusValidator
};
