const User = require("../models/users");
const { body, validationResult } = require("express-validator");

exports.user_create_get = function (req, res) {
  res.render("user_form");
};

exports.user_create_post = [
  // Validate and sanitize the name field.
  body("userName", "User Name Required").trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a receipt object with escaped and trimmed data.
    let user = new User({
      userName: req.body.userName,
      userPass: req.body.userPass,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      birthDay: req.body.birthDay,
      email: req.body.email,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("user_form", {
        title: "New User Form",
        user: user,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Receipt with same name already exists.
      User.findOne({ userName: req.body.userName }).exec(function (
        err,
        found_user
      ) {
        if (err) {
          return next(err);
        }

        if (found_user) {
          // Receipt exists, redirect to its detail page.
          res.redirect(found_user.url);
        } else {
          user.save(function (err) {
            if (err) {
              return next(err);
            }
            // Receipt saved. Redirect to genre detail page.
            res.render("user_success", {
              title: req.body.userName,
            });
          });
        }
      });
    }
  },
];
exports.user_create_success = function (req, res) {
  res.render("user_success");
};

exports.user_detail_get = function (req, res) {
  User.findById(req.params.id, function (err, results, next) {
    if (err) {
      return next(err);
    } else {
      res.render("user_detail", {
        title: results.userName,
        results: results,
      });
    }
  });
};
