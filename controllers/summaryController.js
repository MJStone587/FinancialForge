const async = require("async");
const Income = require("../models/income");
const Receipt = require("../models/receipt");

exports.summary_full = function (req, res) {
  if (req.session.isAuth) {
    async.parallel(
      {
        income: function (callback) {
          Income.find({ author: req.session.authUserID }).exec(callback);
        },
        receipt: function (callback) {
          Receipt.find({ author: req.session.authUserID }).exec(callback);
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
          authUser: req.session.authUser,
          authorID: req.session.authUserID,
          authCheck: req.session.isAuth,
        });
      }
    );
  } else {
    async.parallel(
      {
        income: function (callback) {
          Income.find({ author: "62a21b717001a8755da33cf7" }).exec(callback);
        },
        receipt: function (callback) {
          Receipt.find({ author: "62a21b717001a8755da33cf7" }).exec(callback);
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
          authUser: "Sample",
          authorID: "62a21b717001a8755da33cf7",
          authCheck: req.session.isAuth,
        });
      }
    );
  }
};
