const express = require("express");
const router = express.Router();
const passport = require("passport");
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
    try {
      const { username, email, password, password2 } = req.body.user;
      if (password !== password2) {
        req.flash("error", "Passwords do not match.");
        return res.redirect("/register");
      }
      const newUser = new User({ username, email });
      const registeredUser = await User.register(newUser, password);
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", `Welcome to MotoMeter ${username}`);
      });
    } catch (e) {
      let msg = e.message;
      if (msg.includes("email_1"))
        msg = "A user with the given email is already registered";
      req.flash("error", `${msg}`);
      return res.redirect("/register");
    }
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
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  catchAsync(async (req, res, next) => {
    req.flash("success", "welcome back!");
    const redirectUrl = req.session.intendedRoute || "/";
    delete req.session.intendedRoute;
    res.redirect(redirectUrl);
  })
);

// Get Logout - "/logout"
router.get("/logout", (req, res, next) => {
  req.logout();
  req.flash("success", "Logged out.");
  res.redirect("/");
});

module.exports = router;
