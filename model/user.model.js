const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["User", "Moderator"],
    default: "User",
  },
});

const UserModel = mongoose.model("user", UserSchema);

module.exports = { UserModel };
