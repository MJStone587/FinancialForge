const Receipt = require("../models/receipt");
const { body, validationResult } = require("express-validator");

exports.index = function (req, res) {
  let authCheck = req.session.isAuth;
  res.render("index", {
    title: "Financial Organizer",
    authCheck: authCheck,
    userName: req.session.authUser,
    userID: req.session.authUserID,
  });
};

exports.receipt_list = function (req, res, next) {
  let userName = req.session.authUserID;
  if (req.session.isAuth) {
    Receipt.find()
      .populate(userName)
      .sort([["title", "descending"]])
      .exec(function (err, list_receipt) {
        if (err) {
          return next(err);
        } else {
          res.render("receipt_list", {
            title: "Expenses",
            receipt_list: list_receipt,
            authorID: userName,
          });
        }
      });
  } else {
    Receipt.find()
      .sort([["title", "descending"]])
      .exec(function (err, list_receipt) {
        if (err) {
          return next(err);
        } else {
          res.render("receipt_list", {
            title: "Expenses",
            receipt_list: list_receipt,
          });
        }
      });
  }
};

exports.receipt_create_get = function (req, res, next) {
  console.log(req.session.isAuth);
  if (req.session.isAuth) {
    res.render("receipt_form", {
      title: "Receipt Creation Form",
      userID: req.session.authUserID,
      userName: req.session.authUser,
    });
  } else {
    res.render("user_login", {
      message: "You must login to create additional expenses",
    });
  }
};

// Handle Receipt create on POST.
exports.receipt_create_post = [
  // Validate and sanitize the name field.
  body("name", "Receipt Name Required").trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a receipt object with escaped and trimmed data.
    let receipt = new Receipt({
      name: req.body.name,
      description: req.body.description,
      paymentType: req.body.paymentType,
      ccName: req.body.ccName,
      date: req.body.date,
      total: req.body.total,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("receipt_form", {
        title: "New Receipt Form",
        receipt: receipt,
        errors: errors.array(),
        userID: req.session.authUserID,
        userName: req.session.authUser,
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Receipt with same name already exists.
      Receipt.findOne({ name: req.body.name }).exec(function (
        err,
        found_receipt
      ) {
        if (err) {
          return next(err);
        }

        if (found_receipt) {
          // Receipt exists, redirect to its detail page.
          res.redirect(found_receipt.url);
        } else {
          receipt.save(function (err) {
            if (err) {
              return next(err);
            }
            // Receipt saved. Redirect to genre detail page.
            res.redirect(receipt.url);
          });
        }
      });
    }
  },
];
exports.receipt_detail = function (req, res) {
  Receipt.findById(req.params.id, function (err, results) {
    if (err) {
      return next(err);
    } else {
      res.render("receipt_detail", {
        title: "Receipt Details",
        results: results,
        userID: req.session.authUserID,
        userName: req.session.authUser,
      });
    }
  });
};
// Display Author delete form on GET.
exports.receipt_delete_get = function (req, res, next) {
  Receipt.findById(req.params.id, function (err, results) {
    if (err) {
      return next(err);
    } else {
      res.render("receipt_delete", {
        title: "Receipt Deletion",
        results: results,
      });
    }
  });
};

exports.receipt_delete_post = function (req, res) {
  Receipt.findByIdAndRemove(req.body.receiptid, function deleteReceipt(err) {
    if (err) {
      return next(err);
    }
    res.redirect("/catalog/receipts");
  });
};

exports.receipt_update_get = function (req, res, next) {
  Receipt.findById(req.params.id, function (err, results) {
    if (err) {
      return next(err);
    } else {
      res.render("receipt_update", {
        title: "Receipt Update",
        results: results,
      });
    }
  });
};

exports.receipt_update_post = function (req, res, next) {
  var receipt = new Receipt({
    name: req.body.name,
    description: req.body.description,
    paymentType: req.body.paymentType,
    ccName: req.body.ccName,
    date: req.body.date,
    total: req.body.total,
    _id: req.params.id, //This is required, or a new ID will be assigned!
  });
  Receipt.findByIdAndUpdate(req.params.id, receipt, function (err) {
    if (err) {
      return next(err);
    } else {
      res.redirect("/catalog/receipts");
    }
  });
};
