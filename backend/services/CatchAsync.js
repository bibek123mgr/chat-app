const { ENVIRONMENT } = require("../config/config");
const { Environment } = require("./type");

const CatchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(err => {
            const statusCode = err.statusCode || 500;
            res.status(statusCode).json({
                message: ENVIRONMENT == Environment.DEVELOPMENT ? err.message : ''
            });
        });
    };
};

module.exports = CatchAsync;
