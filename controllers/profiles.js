const Profile = require("../models/profile");

module.exports = {
  async createProfile(req, res, next) {
    const newProfile = new Profile(req.body.profile);
    await newProfile.save();
    res.redirect(`/profiles/${newProfile._id}`);
  },
  async getProfile(req, res, next) {
    // Fetch profile by id, populate tasks
    const profile = await Profile.findOne({
      _id: req.params.profileId,
    }).populate("tasks");
    res.render("profiles/profile", { profile });
  },
  async updateProfile(req, res, next) {
    await Profile.findByIdAndUpdate(req.params.profileId, {
      hours: req.body.hours,
    });
    res.redirect(`/profiles/${req.params.profileId}`);
  },
};
