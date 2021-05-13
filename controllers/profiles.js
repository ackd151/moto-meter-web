const Profile = require("../models/profile");
const compareTasks = require("../utils/compareTasks");

module.exports = {
  async createProfile(req, res, next) {
    const newProfile = new Profile(req.body.profile);
    await newProfile.save();
    req.flash("success", "New dirtbike profile created.");
    res.redirect(`/profiles/${newProfile._id}`);
  },
  async getProfile(req, res, next) {
    // Fetch profile by id, populate tasks
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
    res.redirect(`/profiles/${req.params.profileId}`);
  },
};
