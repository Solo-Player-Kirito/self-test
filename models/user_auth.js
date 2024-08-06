const mongoose = require("mongoose");
const schema = mongoose.Schema;
const user = new schema({
  name: String,
  email: String,
  password: String,
  file: String,
});
const model = mongoose.model("user", user);

module.exports = model;
