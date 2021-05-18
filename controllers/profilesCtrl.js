const Profile = require("../models/profileModel");
const User = require("../models/userModel");
const compareTasks = require("../utils/compareTasks");

module.exports = {
  async createProfile(req, res, next) {
    const user = await User.findOne({ username: req.params.username });
    const newProfile = new Profile(req.body.profile);
    user.bikeProfiles.push(newProfile);
    await newProfile.save();
    await user.save();
    req.flash("success", "New dirtbike profile created.");
    res.redirect(`/home/${req.params.username}/profiles/${newProfile._id}`);
  },
  async getProfile(req, res, next) {
    const profile = await Profile.findById(req.params.profileId).populate(
      "tasks"
    );
    // Sort tasks
    const { tasks } = profile;
    for (const task of tasks) {
      task.remainingHours = await task.getRemainingHours();
    }
    tasks.sort(compareTasks);

    res.render("pages/profile", { profile });
  },
  async updateProfile(req, res, next) {
    await Profile.findByIdAndUpdate(req.params.profileId, {
      hours: req.body.hours,
    });
    res.redirect(
      `/home/${req.params.username}/profiles/${req.params.profileId}`
    );
  },
  async getPostRide(req, res, next) {
    const profile = await Profile.findById(req.params.profileId);
    res.render("pages/postRide", { profile });
  },
};
