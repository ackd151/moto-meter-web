const User = require("../models/userModel");
const Profile = require("../models/profileModel");

module.exports = {
  isLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
      req.session.intendedRoute = req.originalUrl;
      req.flash("error", "You must be logged in to do that.");
      return res.redirect("/login");
    }
    next();
  },
  async ownsProfile(req, res, next) {
    const user = await User.findOne({ username: req.user.username });
    const isOwner = user.bikeProfiles.some((profile) =>
      profile._id.equals(req.params.profileId)
    );
    if (!isOwner) {
      req.flash("error", "Hey, that's not yours!");
      return res.redirect(`/home/${res.locals.currentUser.username}`);
    }
    next();
  },
  activePage(req, res, next) {
    let page = "profile";
    if (req.originalUrl.indexOf("inspections") > 0) {
      page = "inspections";
    } else if (req.originalUrl.indexOf("post-ride") > 0) {
      page = "post-ride";
    } else if (req.originalUrl.indexOf("maintenance") > 0) {
      page = "maintenance";
    } else if (req.originalUrl.indexOf("notes") > 0) {
      page = "notes";
    }
    res.locals.activePage = page;
    next();
  },
};
