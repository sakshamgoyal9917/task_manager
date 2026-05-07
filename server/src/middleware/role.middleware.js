const ApiError = require("../utils/ApiError");

// Returns middleware function for the specified roles
// Usage: restrictTo("admin") or restrictTo("admin", "member")
const restrictTo = (...allowedRoles) => {
  return (req, res, next) => {
    // req.user is set by protect middleware (must run first)
    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(
        403,
        "You do not have permission to perform this action"
      );
    }
    next();
  };
};

module.exports = { restrictTo };