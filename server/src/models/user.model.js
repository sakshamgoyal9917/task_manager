const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,               // removes leading/trailing spaces
      minlength: [2, "Name must be at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,             // creates a DB index automatically
      lowercase: true,          // always store email in lowercase
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,            // NEVER return password in queries by default
    },
    role: {
      type: String,
      enum: ["admin", "member"], // only these two values allowed
      default: "member",
    },
  },
  {
    timestamps: true,           // auto adds createdAt and updatedAt
  }
);

// ─── Hash password before saving ─────────────────────────────────
// This is a Mongoose "pre-save hook"
// Runs automatically before every .save() call
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// ─── Instance method to compare passwords ────────────────────────
// Called as: user.comparePassword("plaintext")
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;