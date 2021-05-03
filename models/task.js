const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const Profile = require("./profile");

const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  interval: {
    type: Number,
    required: true,
  },
  lastCompletedAt: {
    type: Number,
    required: true,
  },
});

taskSchema.virtual("remainingHours").get(async function () {
  const profile = await Profile.findOne({
    "tasks._id": { $elemMatch: { _id: this._id } },
  });
  console.log(profile);
});

module.exports = model("Task", taskSchema);
