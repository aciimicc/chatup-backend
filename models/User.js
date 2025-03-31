const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  username: { type: String, unique: true },
  password: String,
  dateOfBirth: Date,
  profilePicture: { type: String, default: "" },
});

module.exports = mongoose.model("User", UserSchema);
