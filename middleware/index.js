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
    const user = await User.findById(res.locals.currentUser._id);
    const isOwner = user.bikeProfiles.some((profile) =>
      profile._id.equals(req.params.profileId)
    );
    if (!isOwner) {
      req.flash("error", "Hey, that's not yours!");
      return res.redirect(`/home/${res.locals.currentUser.username}`);
    }
    next();
  },
};
