const Receipt = require("../models/receipt");

exports.index = function (req, res) {
  res.render("index", { title: "Financial Organizer" });
};

exports.receipt_list = function (req, res) {
  Receipt.find()
    .sort([["title", "descending"]])
    .exec(function (err, list_receipt) {
      if (err) {
        return next(err);
      } else {
        res.render("receipt_list", {
          title: "Receipt List",
          receipt_list: list_receipt,
        });
      }
    });
};
