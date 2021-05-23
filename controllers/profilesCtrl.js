const Profile = require("../models/profileModel");
const User = require("../models/userModel");
const Inspection = require("../models/inspectionModel");

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
    const profile = await Profile.findById(req.params.profileId);

    res.render("pages/profile", { profile });
  },
  async updateProfile(req, res, next) {
    if (req.body.profile) {
      const { year, make, model, hours } = req.body.profile;
      await Profile.findByIdAndUpdate(req.params.profileId, {
        year,
        make,
        model,
        hours,
      });
    } else if (req.body.hours) {
      const { hours } = req.body;
      await Profile.findByIdAndUpdate(req.params.profileId, {
        hours,
      });
      // reset pre-ride checklist
      await Inspection.reset(req.params.profileId);
    }
    res.redirect(
      `/home/${req.params.username}/profiles/${req.params.profileId}`
    );
  },
  async getPostRide(req, res, next) {
    const profile = await Profile.findById(req.params.profileId);
    res.render("pages/postRide", { profile });
  },
  async deleteProfile(req, res, next) {
    console.log("In DELETE");
    await User.findOneAndUpdate(
      { username: req.params.username },
      {
        $pull: { bikeProfiles: req.params.profileId },
      }
    );
    await Profile.findByIdAndDelete(req.params.profileId);
    req.flash("success", "Bike profile successfully deleted.");
    res.redirect(`/home/${req.user.username}`);
  },
};
