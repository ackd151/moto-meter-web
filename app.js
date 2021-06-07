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
const MongoStore = require("connect-mongo");
const app = express();

/* Import Routes */
const indexRoutes = require("./routes/indexRout");
const profileRoutes = require("./routes/profilesRout");
const taskRoutes = require("./routes/tasksRout");
const inspectionRoutes = require("./routes/inspectionsRout");
const noteRoutes = require("./routes/notesRout");

/* Model imports */
const User = require("./models/userModel");
const Profile = require("./models/profileModel");
const Task = require("./models/taskModel");

/* Set up db */
const dbUrl = "mongodb://localhost:27017/motoMeterDB"; // process.env.DB_URL ||
mongoose.connect(dbUrl, {
  //"mongodb://localhost:27017/motoMeterDB"
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

// Use mongo for session store
const store = MongoStore.create({
  mongoUrl: dbUrl,
  secret: process.env.SESSION_SECRET,
  touchAfter: 24 * 60 * 60,
});
store.on("error", function (e) {
  console.log("Session Store Error", e);
});

/* Session config */
const sessionOptions = {
  store,
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
passport.deserializeUser(User.deserializeUser()); /* site-wide vars */

/* Flash config */
app.use(flash());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

//***********************************DEV********************************* */

// app.use((req, res, next) => {
//   req.user = {
//     _id: "60b6c5c91b9571329c173ddd",
//     username: "ackd151",
//   };
//   res.locals.currentUser = req.user;
//   next();
// });

//*********************************************************************** */

/* Mount Routes */
app.use("/", indexRoutes);
app.use("/:username/garage", profileRoutes);
app.use("/:username/garage/:profileUrl/maintenance", taskRoutes);
app.use("/:username/garage/:profileUrl/inspections", inspectionRoutes);
app.use("/:username/garage/:profileUrl/notes", noteRoutes);

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
