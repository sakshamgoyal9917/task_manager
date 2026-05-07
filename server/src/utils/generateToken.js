const jwt = require("jsonwebtoken");

const generateToken = (userId, role) => {
  return jwt.sign(
    // Payload — data embedded in the token
    { userId, role },

    // Secret key — used to sign and verify
    process.env.JWT_SECRET,

    // Options
    { expiresIn: "7d" }         // token expires in 7 days
  );
};

module.exports = generateToken;