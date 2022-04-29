const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

let ReceiptSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  paymentType: {
    type: String,
    required: true,
  },
  ccName: {
    type: String,
    required: false,
  },
  date: { type: Date, required: false },
  total: { type: Number },
});

ReceiptSchema.virtual("url").get(function () {
  return "/catalog/receipt/" + this._id;
});

ReceiptSchema.virtual("date_formatted").get(function () {
  return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model("Receipt", ReceiptSchema);
