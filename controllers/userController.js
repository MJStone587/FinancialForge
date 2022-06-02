const User = require("../models/users");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const passport = require("passport");

exports.user_create_get = function (req, res) {
  res.render("user_form");
};

exports.user_create_post = [
  // Validate and sanitize the name field.
  body("userName", "User Name Required").trim().isLength({ min: 1 }).escape(),
  body("userPass", "This Password is Weak AF try again.")
    .trim()
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      returnScore: false,
      pointsPerUnique: 1,
      pointsPerRepeat: 0.5,
      pointsForContainingLower: 10,
      pointsForContainingUpper: 10,
      pointsForContainingNumber: 10,
      pointsForContainingSymbol: 10,
    })
    .escape(),
  body("email", "Not a valid email address, try again")
    .trim()
    .isEmail()
    .escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errorFormatter = ({ msg }) => {
      // Build your resulting errors however you want! String, object, whatever - it works!
      return `${msg}`;
    };
    const errors = validationResult(req).formatWith(errorFormatter);

    bcrypt.hash(req.body.userPass, saltRounds, function (err, hash) {
      if (err) {
        return next(err);
      } else {
        var hashedPass = hash;
      }
      let user = new User({
        userName: req.body.userName,
        userPass: hashedPass,
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
            res.render("user_form", {
              title: "New User Form",
              user: user,
              errors: "That Username is already in Use",
            });
          } else {
            user.save(function (err) {
              if (err) {
                return next(err);
              }
              // Receipt saved. Redirect to genre detail page.
              res.render("index", {
                title:
                  "Success " + req.body.userName + " Successfully registered",
              });
            });
          }
        });
      }
    });
  },
];

exports.user_detail_get = function (req, res, next) {
  User.findById(req.params.id, function (err, results) {
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

exports.user_login_get = function (req, res) {
  res.render("user_login", {
    message: "Login with Username and Password",
    userNameDisp: " ",
  });
};

exports.user_login_post = function (req, res, next) {
  User.findOne({ userName: req.body.userName }).exec(function (
    err,
    found_user
  ) {
    if (err) {
      return next(err);
    }
    // NEEDS IMPROVEMENT AND ALL ERRORS HANDLED

    if (!req.body.userName || !req.body.userPass) {
      res.render("user_login", {
        message: "Username or password missing, try again",
        userNameDisp: req.body.userName,
      });
    } else {
      const passAuth = bcrypt.compareSync(
        req.body.userPass,
        found_user.userPass
      );
      if (passAuth === true) {
        res.render("user_login", {
          message: "Succesfully Logged In",
          userNameDisp: "",
        });
      } else {
        res.render("user_login", {
          message: "Incorrect Password",
          userNameDisp: req.body.userName,
        });
      }
    }
  });
};
