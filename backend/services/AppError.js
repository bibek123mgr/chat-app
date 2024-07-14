const { ENVIRONMENT } = require("../config/config");
const { Environment } = require("./type");

class AppError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.message = message
    this.name='message'
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    this.stack = ENVIRONMENT == Environment.DEVELOPMENT ? Error.captureStackTrace(this, this.constructor) : undefined;
  }
}

module.exports = AppError;
