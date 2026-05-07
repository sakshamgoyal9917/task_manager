const User = require("../models/user.model");
const generateToken = require("../utils/generateToken");
const ApiError = require("../utils/ApiError");

// ─── SIGNUP ───────────────────────────────────────────────────────
const signup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, "Email already registered");
    }

    // 2. Create user — password hashing happens automatically in pre-save hook
    const user = await User.create({ name, email, password, role });

    // 3. Generate JWT
    const token = generateToken(user._id, user.role);

    // 4. Send response — never send password back
    res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    // Pass to global error handler
    next(error);
  }
};

// ─── LOGIN ────────────────────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Basic validation
    if (!email || !password) {
      throw new ApiError(400, "Email and password are required");
    }

    // 2. Find user — explicitly select password (it's excluded by default)
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      // Intentionally vague — don't reveal whether email exists
      throw new ApiError(401, "Invalid email or password");
    }

    // 3. Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(401, "Invalid email or password");
    }

    // 4. Generate JWT
    const token = generateToken(user._id, user.role);

    // 5. Send response
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET CURRENT USER ─────────────────────────────────────────────
// Protected route — returns logged-in user's data
const getMe = async (req, res, next) => {
  try {
    // req.user is set by auth middleware
    const user = await User.findById(req.user.userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, login, getMe };