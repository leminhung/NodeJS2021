const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "Email là bắt buộc"],
    unique: [true, "Email phải là duy nhất"],
  },
  password: {
    type: String,
    required: [true, "Mật khẩu được yêu cầu"],
  },
  role: {
    type: String,
  },
  resetToken: String,
  resetTokenExpiration: Date,
});

module.exports = mongoose.model("User", userSchema);
