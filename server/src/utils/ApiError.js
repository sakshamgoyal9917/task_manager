class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);           // calls Error constructor, sets this.message
    this.statusCode = statusCode;
    this.isOperational = true; // marks this as a known, handled error

    // Captures stack trace, excluding constructor call from it
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;