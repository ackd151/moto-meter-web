const User = require("../models/userModel");

module.exports = {
  isLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
      req.session.intendedRoute = req.originalUrl;
      req.flash("error", "You must be logged in to do that.");
      return res.redirect("/login");
    }
    next();
  },
  /* 
    Profile urls are built using profile.title and are not unique, must get appropriate 
    target id by looking only at active user's profile urls.
  */
  async getTargetId(req, res, next) {
    const user = await User.findOne({ username: req.params.username }).populate(
      "bikeProfiles"
    );
    for (const profile of user.bikeProfiles) {
      if (profile.url === req.params.profileUrl) {
        req.targetId = profile._id;
      }
    }
    next();
  },
  async ownsProfile(req, res, next) {
    const isOwner = req.user.bikeProfiles.some((profile) =>
      profile._id.equals(req.targetId)
    );
    if (!isOwner) {
      req.flash("error", "Hey, that's not yours!");
      return res.redirect(`/${req.user.username}`);
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
