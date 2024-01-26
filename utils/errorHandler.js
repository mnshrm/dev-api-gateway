class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.success = false;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports.ErrorHandler = ErrorHandler;
