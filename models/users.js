const mongoose = require("mongoose");
const { DateTime } = require("luxon");
const { isEmail } = require("validator");

const Schema = mongoose.Schema;

let UserSchema = new Schema({
  userName: { type: String, required: true },
  userPass: { type: String, minLength: 5, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  birthDay: { type: Date, required: true },
  email: {
    type: String,
    validate: [isEmail, "Please use a correct email address"],
    required: true,
  },
});

UserSchema.virtual("url").get(function () {
  return "/catalog/user/" + this._id;
});

UserSchema.virtual("birthDay_formatted").get(function () {
  return DateTime.fromJSDate(this.birthDay).toLocaleString(DateTime.DATE_MED);
});

UserSchema.virtual("birthDay_adjusted").get(function () {
  return this.birthDay.toLocaleDateString("en-CA");
});

module.exports = mongoose.model("User", UserSchema);
