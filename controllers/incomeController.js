const Income = require("../models/income");
const { body, validationResult } = require("express-validator");

exports.income_list = function (req, res) {
  if (req.session.isAuth) {
    Income.find({ author: req.session.authUserID })
      .sort([["title", "descending"]])
      .exec(function (err, results) {
        if (err) {
          return next(err);
        } else {
          res.render("income_list", {
            title: "Income",
            results: results,
            authorID: req.session.authUserID,
            authUser: req.session.authUser,
            authCheck: req.session.isAuth,
          });
        }
      });
  } else {
    Income.find({ author: "62a21b717001a8755da33cf7" })
      .sort([["title", "descending"]])
      .exec(function (err, results) {
        if (err) {
          return next(err);
        } else {
          res.render("income_list", {
            title: "Expenses",
            results: results,
            authorID: "62a21b717001a8755da33cf7",
            authUser: "Sample",
            authCheck: req.session.isAuth,
          });
        }
      });
  }
};

exports.income_create_get = function (req, res) {
  if (req.session.isAuth) {
    res.render("income_form", {
      title: "Income Form",
      authCheck: req.session.isAuth,
      authorID: req.session.authUserID,
      authUser: req.session.authUser,
    });
  } else {
    res.render("user_login", {
      message: "You must login to create income additions",
    });
  }
};

// Handle Income create on POST.
exports.income_create_post = [
  // Validate and sanitize the name field.
  body("name", "Name Required").trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a receipt object with escaped and trimmed data.
    let income = new Income({
      name: req.body.name,
      description: req.body.description,
      from: req.body.from,
      date: req.body.date,
      author: req.body.author,
      amount: req.body.amount,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("income_form", {
        title: "New Income Form",
        income: income,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Receipt with same name already exists.
      Income.findOne({ description: req.body.description }).exec(function (
        err,
        found_income
      ) {
        if (err) {
          return next(err);
        }

        if (found_income) {
          // Receipt exists, redirect to its detail page.
          res.redirect(found_income.url);
        } else {
          income.save(function (err) {
            if (err) {
              return next(err);
            }
            // Receipt saved. Redirect to genre detail page.
            res.redirect(income.url);
          });
        }
      });
    }
  },
];

exports.income_detail = function (req, res) {
  if (req.session.isAuth) {
    Income.findById(req.params.id, function (err, results) {
      if (err) {
        return next(err);
      } else {
        res.render("income_detail", {
          title: "Income Details",
          results: results,
          authCheck: req.session.isAuth,
          authorID: req.session.authUserID,
          authUser: req.session.authUser,
        });
      }
    });
  } else {
    Income.findById(req.params.id, function (err, results) {
      if (err) {
        return next(err);
      } else {
        res.render("income_detail", {
          title: "Income Details",
          results: results,
          authCheck: req.session.isAuth,
        });
      }
    });
  }
};
// Display Author delete form on GET.
exports.income_delete_get = function (req, res, next) {
  Income.findById(req.params.id, function (err, results) {
    if (err) {
      return next(err);
    } else {
      res.render("income_delete", {
        title: "Income Deletion",
        results: results,
      });
    }
  });
};

exports.income_delete_post = function (req, res) {
  Income.findByIdAndRemove(req.body.incomeid, function deleteIncome(err) {
    if (err) {
      return next(err);
    }
    res.redirect("/catalog/incomes");
  });
};

exports.income_update_get = function (req, res, next) {
  Income.findById(req.params.id, function (err, results) {
    if (err) {
      return next(err);
    } else {
      res.render("income_update", {
        title: "Income Update",
        results: results,
        authCheck: req.session.isAuth,
        authUserID: req.session.authUserID,
        authUser: req.session.authUser,
      });
    }
  });
};

exports.income_update_post = function (req, res, next) {
  var income = new Income({
    name: req.body.name,
    description: req.body.description,
    from: req.body.from,
    date: req.body.date,
    amount: req.body.amount,
    _id: req.params.id, //This is required, or a new ID will be assigned!
  });
  Income.findByIdAndUpdate(req.params.id, income, function (err) {
    if (err) {
      return next(err);
    } else {
      res.redirect("/catalog/incomes");
    }
  });
};
