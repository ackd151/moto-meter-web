const Profile = require("../models/profileModel");
const User = require("../models/userModel");
const Inspection = require("../models/inspectionModel");
const cloudinary = require("cloudinary").v2;

module.exports = {
  async createProfile(req, res, next) {
    const user = await User.findOne({ username: req.params.username }).populate(
      "bikeProfiles"
    );
    let profileInfo = req.body.profile;
    profileInfo.url = `${profileInfo.year}_${profileInfo.make}_${profileInfo.model}`;
    // enforce unique url per user !Needs fix w/ regex and max! Dups can still happen after deletion
    let dup = 0;
    for (const profile of user.bikeProfiles) {
      console.log(
        profileInfo.url,
        profile.url,
        profileInfo.url.indexOf(profile.url)
      );
      if (profile.url.indexOf(profileInfo.url) >= 0) {
        ++dup;
      }
    }
    if (dup) {
      profileInfo.url += `_(${dup + 1})`;
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
  async getProfile(req, res, next) {
    const profile = await Profile.findById(req.targetId);
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
