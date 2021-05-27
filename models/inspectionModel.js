const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const Profile = require("../models/profileModel");

const inspectionSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

inspectionSchema.statics.inspectionsComplete = async function (profileId) {
  const profile = await Profile.findById(profileId).populate("inspections");
  if (!profile.inspections.length) {
    return false;
  }
  for (const inspection of profile.inspections) {
    if (!inspection.completed) return false;
  }
  return true;
};

inspectionSchema.statics.reset = async function (profileId) {
  const profile = await Profile.findById(profileId).populate("inspections");
  for (const inspection of profile.inspections) {
    inspection.completed = false;
    await inspection.save();
  }
};

module.exports = model("Inspection", inspectionSchema);
