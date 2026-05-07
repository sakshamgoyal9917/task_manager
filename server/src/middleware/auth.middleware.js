const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");

const protect = async (req, res, next) => {
  try {
    // 1. Get token from Authorization header
    // Header format: "Bearer eyJhbGc..."
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "No token provided. Please login.");
    }

    // 2. Extract token (remove "Bearer " prefix)
    const token = authHeader.split(" ")[1];

    // 3. Verify token — throws if expired or tampered
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach user info to request object
    // Now every downstream controller can access req.user
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === "JsonWebTokenError") {
      return next(new ApiError(401, "Invalid token"));
    }
    if (error.name === "TokenExpiredError") {
      return next(new ApiError(401, "Token expired. Please login again."));
    }
    next(error);
  }
};

module.exports = { protect };