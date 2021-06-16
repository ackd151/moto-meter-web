const Profile = require("../models/profileModel");
const User = require("../models/userModel");
const Inspection = require("../models/inspectionModel");
const compareTasks = require("../utils/compareTasks");
const cloudinary = require("cloudinary").v2;

module.exports = {
  async getProfile(req, res, next) {
    const profile = await Profile.findById(req.targetId).populate("tasks");
    // Sort profile tasks, populate remainingHours on each, and get pre-ride status
    const { tasks } = profile;
    // Calculate remaining hours
    for (const task of tasks) {
      task.remainingHours = await task.getRemainingHours();
    }
    // Sort
    tasks.sort(compareTasks);
    // Get pre-ride status
    profile.completed = await Inspection.inspectionsComplete(profile._id);

    res.render("pages/profile", { profile });
  },
  async updateProfile(req, res, next) {
    const profile = await Profile.findById(req.targetId);
    if (req.body.profile) {
      const { year, make, model, hours } = req.body.profile;
      profile.year = year;
      profile.make = make;
      profile.model = model;
      profile.hours = hours;
      profile.url = `${year}_${make}_${model}`;
      if (req.file) {
        // Remove old image from cloudinary if new image supplied
        const oldImage = profile.image;
        if (oldImage) {
          cloudinary.uploader.destroy(oldImage.filename);
        }
        const { path, filename } = req.file;
        profile.image = { path, filename };
      }
    } else if (req.body.hours) {
      profile.hours = req.body.hours;
      // reset pre-ride checklist
      await Inspection.reset(profile._id);
    }
    await profile.save();
    req.flash("success", "Bike profile edited successfully.");
    res.redirect(`/${req.params.username}/garage/${profile.url}`);
  },
  async getPostRide(req, res, next) {
    const profile = await Profile.findById(req.targetId);
    res.render("pages/postRide", { profile });
  },
  async deleteProfile(req, res, next) {
    const profile = await Profile.findById(req.targetId);
    // Remove image from cloudinary
    const { filename } = profile.image;
    if (filename) {
      cloudinary.uploader.destroy(filename);
    }
    // Remove bike profile from User object
    await User.findOneAndUpdate(
      { username: req.params.username },
      {
        $pull: { bikeProfiles: profile._id },
      }
    );
    // Remove profile from db
    await Profile.findByIdAndDelete(profile._id);
    req.flash("success", "Bike profile successfully deleted.");
    res.redirect(`/${req.user.username}`);
  },
};
