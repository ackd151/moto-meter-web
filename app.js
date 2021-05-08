/* Application imports */
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const logger = require("morgan");
const ExpressError = require("./utils/ExpressError");
const app = express();

/* Import Routes */
const indexRoutes = require("./routes/index");
const profileRoutes = require("./routes/profiles");
const taskRoutes = require("./routes/tasks");

/* Model imports */
const User = require("./models/user");
const Profile = require("./models/profile");
const Task = require("./models/task");

/* Set up db (local) */
mongoose.connect("mongodb://localhost:27017/motoMeterDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error: "));
db.once("open", () => console.log("MongoDB connected."));

/* Configure app */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", engine);
app.use(logger("tiny"));
app.use(methodOverride("_method"));

/* Session config */
const sessionOptions = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionOptions));

/* Passport config */
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* Flash config */
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

/* Mount Routes */
app.use("/", indexRoutes);
app.use("/profiles", profileRoutes);
app.use("/profiles/:profileId/tasks", taskRoutes);

/* Invalid routes */
app.all("*", (req, res, next) => {
  next(new ExpressError("Invalid URL", 404));
});

/* Error Handling */
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something Went Wrong!";
  res.status(statusCode).render("error", { err });
  next(err);
});

/* Start server */
const { PORT = 3000 } = process.env;
app.listen(PORT, console.log(`Listening on port: ${PORT}`));
