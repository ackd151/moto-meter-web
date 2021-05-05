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

taskSchema.methods.getRemainingHours = async function () {
  const profile = await Profile.findOne({
    tasks: {
      $in: this._id,
    },
  });
  // console.log(this.lastCompletedAt + this.interval - profile.hours);
  return this.lastCompletedAt + this.interval - profile.hours;
};

module.exports = model("Task", taskSchema);
