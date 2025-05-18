const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: String,
    email: { type: String, unique: true },
    passwordHash: String,
    occupation: String,
    mobileNumber: String,
    nicNumber: String,
    nicDocument: String,
    role: { type: String, enum: ["donor", "charity", "admin"] },
    image: { type: String, default: "" },
    description: { type: String, default: "" },
    approved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
