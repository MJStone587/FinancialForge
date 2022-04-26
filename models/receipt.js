const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let ReceiptSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  paymentType: {
    type: String,
    required: true,
    enum: ["Debit", "Credit", "Cash", "Check", "Gift Card"],
    default: "Credit",
  },
  ccName: {
    type: String,
    required: false,
    enum: ["MasterCard", "Discover", "Visa", "American Express"],
  },
  date: { type: Date, required: false },
  total: { type: Number },
});

ReceiptSchema.virtual("url").get(function () {
  return "/catalog/receipt/" + this._id;
});

module.exports = mongoose.model("Receipt", ReceiptSchema);
