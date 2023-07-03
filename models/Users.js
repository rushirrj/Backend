const mongoose = require("mongoose");
let userSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile: Number,
  password: String,
});
module.exports = mongoose.model("users", userSchema);
