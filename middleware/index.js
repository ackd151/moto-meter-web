const User = require("../models/userModel");
const { cloudinary } = require("../cloudinary");

module.exports = {
  /* Make sure user is authenticated - redirect to desired route after login if not */
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
  /* Ensure that the targetId belongs to authenticated user */
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
  /* if client-side validations circumvented */
  // profile routes validations
  async validateProfile(req, res, next) {
    /**
     * Used in profile patch route from profile-edit or post-ride.
     * Need to separate logic as post-ride only supplies an hours value.
     */
    const regExpInt = /^\d+$/;
    const regExpFloat = /(?<=^| )\d+(\.\d)?(?=$| )/;
    // req.body.profile - profile create or profile edit
    if (req.body.profile) {
      const { year, hours } = req.body.profile;
      const yearIsNum = regExpInt.test(parseInt(year));
      const hoursIsNum = regExpFloat.test(parseFloat(hours));
      if (!yearIsNum || !hoursIsNum) {
        const errorField = !yearIsNum ? "YEAR" : "HOURS";
        req.flash(
          "error",
          `The ${errorField} value must be a number${
            !hoursIsNum ? ", with at most one decimal place" : ""
          }!`
        );
        // Remove image from cloudinary if validation fails (image uploaded in previous middleware)
        if (req.file) await cloudinary.uploader.destroy(req.file.filename);
        return res.redirect(req.originalUrl.split("?")[0]);
      }
      return next();
    }
    // req.body.hours - post ride
    const { hours } = req.body;
    const hoursIsNum = regExpFloat.test(parseFloat(hours));
    if (!hoursIsNum) {
      req.flash(
        "error",
        `The "hours" value must be a number, with at most one decimal place!`
      );
      return res.redirect(`${req.originalUrl.split("?")[0]}/post-ride`);
    }
    next();
  },
  // task routes validations
  validateTask(req, res, next) {
    const { interval, lastCompletedAt } = req.body.task;
    const regExpFloat = /(?<=^| )\d+(\.\d)?(?=$| )/;
    let intervalIsNum;
    if (interval) {
      intervalIsNum = regExpFloat.test(parseFloat(interval));
    } else {
      intervalIsNum = true;
    }
    const lastCompletedAtIsNum = regExpFloat.test(parseFloat(lastCompletedAt));
    if (!intervalIsNum || !lastCompletedAtIsNum) {
      const errorField = !lastCompletedAtIsNum ? "completed time" : "interval";
      req.flash(
        "error",
        `The ${errorField} value must be a number, with at most one decimal place!`
      );
      return res.redirect(
        `/${req.params.username}/garage/${req.params.profileUrl}/maintenance`
      );
    }
    next();
  },
};
