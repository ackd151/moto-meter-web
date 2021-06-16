const User = require("../models/userModel");
const Profile = require("../models/profileModel");
const Inspection = require("../models/inspectionModel");
const compareTasks = require("../utils/compareTasks");

module.exports = {
  async getUserHome(req, res, next) {
    const user = await User.findOne({ username: req.params.username }).populate(
      {
        path: "bikeProfiles",
        populate: { path: "tasks" },
      }
    );
    // Sort profile tasks, populate remainingHours on each, and get pre-ride status
    for (const profile of user.bikeProfiles) {
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
    // enforce unique url per user
    let dup = false;
    let dupMax = 1; // min start for duplicate (considering increment before use)
    var regExp = /\(([^)]+)\)/; // capture between parens
    for (const profile of user.bikeProfiles) {
      if (profile.url.indexOf(profileInfo.url) >= 0) {
        dup = true;
        let matched = profile.url.match(regExp);
        if (matched) {
          dupMax = Math.max(dupMax, matched[matched.length - 1]);
        }
      }
    }
    if (dup) {
      profileInfo.url += `_(${dupMax + 1})`;
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
