const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const flash = require("express-flash");
const session = require("express-session");
const passport = require("passport");
var MongoDBStore = require("connect-mongodb-session")(session);

const indexRouter = require("./routes/index");
const catalogRouter = require("./routes/catalog");

const app = express();

var store = new MongoDBStore({
  uri: "mongodb+srv://mjstone587:osL9nm3oduCGyhOU@cluster0.47kim.mongodb.net/financial_organizer?retryWrites=true&w=majority",
  collection: "mySessions",
});

const mongoose = require("mongoose");
const mongoDB =
  "mongodb+srv://mjstone587:osL9nm3oduCGyhOU@cluster0.47kim.mongodb.net/financial_organizer?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname + "/public")));
app.use(flash());

app.use(
  require("express-session")({
    secret: "forgeSecret word is nada",
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
    store: store,
    // Boilerplate options, see:
    // * https://www.npmjs.com/package/express-session#resave
    // * https://www.npmjs.com/package/express-session#saveuninitialized
    resave: true,
    saveUninitialized: true,
  })
);

const isAuth = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    res.redirect("user_login");
  }
};

app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRouter);
app.use("/catalog", catalogRouter);

// catch 404 and forward to error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
