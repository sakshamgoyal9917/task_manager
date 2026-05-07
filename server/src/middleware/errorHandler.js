const ApiError = require("../utils/ApiError");

const errorHandler = (err, req, res, next) => {
  // If it's our custom ApiError, use its status code
  // Otherwise, it's an unexpected error → 500
  const statusCode = err.statusCode || 500;

  const message = err.isOperational
    ? err.message
    : "Something went wrong. Please try again.";

  // In development, send stack trace for debugging
  // In production, never expose internals
  if (process.env.NODE_ENV === "development") {
    console.error("ERROR:", err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Only show stack in dev mode
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;