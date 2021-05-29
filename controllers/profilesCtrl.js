const Profile = require("../models/profileModel");
const User = require("../models/userModel");
const Inspection = require("../models/inspectionModel");
const multer = require("multer");
const { storage } = require("../cloudinary");
// const upload = multer({ storage });
const cloudinary = require("cloudinary").v2;

module.exports = {
  async createProfile(req, res, next) {
    const user = await User.findOne({ username: req.params.username });
    const newProfile = new Profile(req.body.profile);
    if (req.file) {
      const { path, filename } = req.file;
      newProfile.image = { path, filename };
    }
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
      const profile = await Profile.findById(req.params.profileId);
      profile.year = year;
      profile.make = make;
      profile.model = model;
      profile.hours = hours;
      if (req.file) {
        // Remove old image from cloudinary if new image supplied
        const oldImage = profile.image;
        if (oldImage) {
          cloudinary.uploader.destroy(oldImage.filename);
        }
        const { path, filename } = req.file;
        profile.image = { path, filename };
      }
      await profile.save();
    } else if (req.body.hours) {
      const { hours } = req.body;
      await Profile.findByIdAndUpdate(req.params.profileId, {
        hours,
      });
      // reset pre-ride checklist
      await Inspection.reset(req.params.profileId);
    }
    req.flash("success", "Bike profile edited successfully.");
    res.redirect(
      `/home/${req.params.username}/profiles/${req.params.profileId}`
    );
  },
  async getPostRide(req, res, next) {
    const profile = await Profile.findById(req.params.profileId);
    res.render("pages/postRide", { profile });
  },
  async deleteProfile(req, res, next) {
    // Remove image from cloudinary
    const profile = await Profile.findById(req.params.profileId);
    const { filename } = profile.image;
    if (filename) {
      cloudinary.uploader.destroy(filename);
    }
    // Remove bike profile from User object
    await User.findOneAndUpdate(
      { username: req.params.username },
      {
        $pull: { bikeProfiles: req.params.profileId },
      }
    );
    // Remove profile from db
    await Profile.findByIdAndDelete(req.params.profileId);
    req.flash("success", "Bike profile successfully deleted.");
    res.redirect(`/home/${req.user.username}`);
  },
};
