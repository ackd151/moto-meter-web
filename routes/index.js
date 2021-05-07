const express = require("express");
const router = express.Router();
const Profile = require("../models/profile");
const User = require("../models/user");
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");

// Get "Home" - "/"
router.get("/", async (req, res, next) => {
  const profiles = await Profile.find({});
  res.render("home", { profiles });
});

// Get Register - "/register"
router.get("/register", (req, res, next) => {
  res.render("users/register");
});

// Post Register - "/register"
router.post(
  "/register",
  catchAsync(async (req, res, next) => {
    const { username, email, password } = req.body.user;
    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);
    res.redirect("/");
  })
);

// Get Login - "/login"
router.get("/login", (req, res, next) => {
  res.render("users/login");
});

// Post Login - "/login"
router.post(
  "/login",
  catchAsync(async (req, res, next) => {})
);

// Post Logout - "/logout"
router.post("/logout", (req, res, next) => {});

router.get("/error", (req, res, next) => {
  throw new ExpressError();
});

module.exports = router;
