const Income = require("../models/income");

exports.income_list = function (req, res) {
  Income.find()
    .sort([["date_formatted", "descending"]])
    .exec(function (err, list_income) {
      if (err) {
        return next(err);
      } else {
        res.render("income_list", {
          title: "Income List",
          results: list_income,
        });
      }
    });
};

exports.income_create_get = function (req, res) {
  res.send("Income Create Get");
};

exports.income_create_post = function (req, res) {
  res.send("Income Create Post");
};

exports.income_delete_get = function (req, res) {
  res.send("Income Delete Get");
};

exports.income_delete_post = function (req, res) {
  res.send("Income delete post");
};

exports.income_update_get = function (req, res) {
  res.send("Income update Get");
};

exports.income_update_post = function (req, res) {
  res.send("Income update post");
};

exports.income_detail = function (req, res) {
  res.send("income detail page");
};
