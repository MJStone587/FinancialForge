const User = require("../models/users");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const saltRounds = 10;
var errorArr = [];

exports.user_create_get = function (req, res) {
  res.render("user_form", {
    authCheck: req.session.isAuth,
    authorID: req.session.authUserID,
    authUser: req.session.authUser,
  });
};

exports.user_create_post = [
  // Validate and sanitize the name field.
  body("userName", "User Name Required").trim().isLength({ min: 1 }).escape(),
  body("userPass", "This Password is Weak AF try again.")
    .trim()
    .isStrongPassword({
      minLength: 5,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 0,
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
          authCheck: req.session.isAuth,
          errors: errors.array(),
        });
        return;
      } else {
        // Data from form is valid.
        // Check if Receipt with same name already exists.
        User.findOne({ email: req.body.email }).exec(function (
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
              errors: "That email is already in Use",
              authCheck: req.session.isAuth,
            });
          } else {
            user.save(function (err) {
              if (err) {
                return next(err);
              }
              // Receipt saved. Redirect to genre detail page.
              res.render("success", {
                message:
                  "Success " + req.body.userName + " Successfully registered",
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
