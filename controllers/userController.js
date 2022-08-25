const User = require("../models/users");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.user_create_get = function (req, res) {
  res.render("signup_form", {
    authCheck: req.session.isAuth,
    authorID: req.session.authUserID,
    authUser: req.session.authUser,
  });
};

exports.user_create_post = [
  // Validate and sanitize the name field.
  body("userName", "Username must be filled in")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body(
    "userPass",
    " Password must be 5 characters with atleast one number and capital"
  )
    .trim()
    .isStrongPassword({
      minLength: 5,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    })
    .escape(),
  body("email", " Not a valid email address").trim().isEmail().escape(),
  body("lastName", " Must fill in Last Name")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("firstName")
    .trim()
    .isLength({ min: 1 })
    .withMessage(" Name field cannot be empty")
    .isAlpha()
    .withMessage(" Name must use alphabetical letters")
    .escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errorFormatter = ({ msg }) => {
      return `${msg}`;
    };
    const errors = validationResult(req).formatWith(errorFormatter);

    bcrypt.hash(req.body.userPass, saltRounds, function (err, hash) {
      if (err) {
        return next(err);
      } else {
        var hashedPass = hash;
        var email = req.body.email;
      }
      let user = new User({
        userName: req.body.userName,
        userPass: hashedPass,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        birthDay: req.body.birthDay,
        email: email.toLowerCase(),
      });
      if (!errors.isEmpty()) {
        // There are errors. Render the form again with sanitized values/error messages.
        res.render("signup_form", {
          title: "Create Login",
          errors: errors.array(),
          authCheck: req.session.isAuth,
        });
      } else {
        // Data from form is valid.
        // Check if user with same email already exists.
        User.findOne({ email: email.toLowerCase() }).exec(function (
          err,
          found_user
        ) {
          if (err) {
            return next(err);
          }

          if (found_user) {
            // Receipt exists, redirect to its detail page.
            res.render("signup_form", {
              title: "New User Form",
              user: user,
              errors: "That email is already in use",
              authCheck: req.session.isAuth,
            });
          } else {
            user.save(function (err) {
              if (err) {
                return next(err);
              }
              res.render("success", {
                message:
                  "Success! " +
                  req.body.userName +
                  " was successfully registered",
                authorID: req.session.authUserID,
                authUser: req.session.authUser,
              });
            });
          }
        });
      }
    });
  },
];

exports.user_detail_get = function (req, res, next) {
  if (req.session.isAuth == true) {
    User.findById(req.session.authUserID, function (err, results) {
      if (err) {
        return next(err);
      } else {
        res.render("user_detail", {
          title: results.userName,
          results: results,
          authorID: req.session.authUserID,
          authUser: req.session.authUser,
        });
      }
    });
  } else {
    return res.redirect("/catalog/user/login");
  }
};

exports.user_login_get = function (req, res) {
  if (req.session.isAuth) {
    let userName = req.session.authUser;
    res.render("user_login", {
      message: `Welcome ${userName}! You are already logged in.`,
      authCheck: req.session.isAuth,
      authorID: req.session.authUserID,
      authUser: req.session.authUser,
    });
  }
  res.render("user_login", {
    message: "Login with Username and Password",
    authCheck: req.session.isAuth,
    authorID: req.session.authUserID,
    authUser: req.session.authUser,
  });
};

exports.user_login_post = async function (req, res) {
  /*const { userName, userPass } = req.body;*/
  var userName = req.body.userName;
  var password = req.body.userPass;

  User.findOne({ userName }, function (err, results) {
    // might require some improvements
    if (err) {
      console.log(err);
    }
    if (results) {
      const match = bcrypt.compareSync(password, results.userPass);
      if (!match) {
        res.render("user_login", {
          message: "Incorrect Password",
          authCheck: req.session.isAuth,
          authorID: req.session.authUserID,
          authUser: req.session.authUser,
        });
      } else if (match) {
        req.session.isAuth = true;
        req.session.authUser = results.userName;
        req.session.authUserID = results._id;
        req.session.authorID = results._id;
        res.redirect("/catalog/user/:id");
      }
    } else {
      res.render("user_login", {
        message: "That username does not exist (usernames are case sensitive)",
        authCheck: req.session.isAuth,
        authorID: req.session.authUserID,
        authUser: req.session.authUser,
      });
    }
  });
};

exports.user_logout = function (req, res) {
  req.session.isAuth = false;
  res.render("logout", {
    authCheck: req.session.isAuth,
    authorID: req.session.authUserID,
    authUser: req.session.authUser,
  });
};
