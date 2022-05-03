const async = require("async");
const Income = require("../models/income");
const Receipt = require("../models/receipt");

exports.summary_full = function (req, res) {
  async.parallel(
    {
      income: function (callback) {
        Income.find().exec(callback);
      },
      receipt: function (callback) {
        Receipt.find().exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      // Successful, so render.
      res.render("summary", {
        title: "Summary",
        incomes: results.income,
        receipts: results.receipt,
      });
    }
  );
};
