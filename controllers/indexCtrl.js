const User = require("../models/userModel");
const Profile = require("../models/profileModel");
const Inspection = require("../models/inspectionModel");
const compareTasks = require("../utils/compareTasks");

module.exports = {
  async getHome(req, res, next) {
    res.render("index");
  },
  getRegister(req, res, next) {
    res.render("users/register");
  },
  async postRegister(req, res, next) {
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
    res.redirect(`/${req.body.user.username}`);
  },
  getLogin(req, res, next) {
    res.render("users/login");
  },
  async postLogin(req, res, next) {
    req.flash("success", `Welcome back, ${req.user.username}!`);
    const redirectUrl = req.session.intendedRoute || `${req.user.username}`;
    delete req.session.intendedRoute;
    res.redirect(redirectUrl);
  },
  getLogout(req, res, next) {
    req.logout();
    req.flash("success", "Logged out.");
    res.redirect("/");
  },
  async getUserHome(req, res, next) {
    const user = await User.findOne({ username: req.params.username }).populate(
      {
        path: "bikeProfiles",
        populate: { path: "tasks" },
      }
    );
    // Sort profile tasks, populate remainingHours on each, and get pre-ride status
    for (const [index, profile] of user.bikeProfiles.entries()) {
      const { tasks } = profile;
      // Calculate remaining hours
      for (const task of tasks) {
        task.remainingHours = await task.getRemainingHours();
      }
      // Sort
      tasks.sort(compareTasks);
      // Get pre-ride status
      profile.completed = await Inspection.inspectionsComplete(profile._id);
    }
    res.render("users/userHome", { user });
  },
  async createProfile(req, res, next) {
    const user = await User.findOne({ username: req.params.username }).populate(
      "bikeProfiles"
    );
    let profileInfo = req.body.profile;
    profileInfo.url = `${profileInfo.year}_${profileInfo.make}_${profileInfo.model}`;
    // enforce unique url per user !Needs fix w/ regex and max! Dups can still happen after deletion
    let dup = 0;
    for (const profile of user.bikeProfiles) {
      // console.log(
      //   profileInfo.url,
      //   profile.url,
      //   profileInfo.url.indexOf(profile.url)
      // );
      if (profile.url.indexOf(profileInfo.url) >= 0) {
        ++dup;
      }
    }
    if (dup) {
      profileInfo.url += `_(${dup + 1})`;
    }
    const newProfile = new Profile(profileInfo);
    if (req.file) {
      const { path, filename } = req.file;
      newProfile.image = { path, filename };
    }
    user.bikeProfiles.push(newProfile);
    await newProfile.save();
    await user.save();
    req.flash("success", "New dirtbike profile created.");
    res.redirect(`/${req.params.username}/garage/${newProfile.url}`);
  },
};
