const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

let UserSchema = new Schema({
  userName: { type: String, required: true },
  userPass: { type: String, minLength: 5, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  birthDay: { type: Date, required: true },
});

module.exports = mongoose.model("User", UserSchema);
