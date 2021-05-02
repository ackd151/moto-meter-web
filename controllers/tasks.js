const Profile = require("../models/profile");
const Task = require("../models/task");

module.exports = {
  async createTask(req, res, next) {
    const { profileId } = req.params;
    // Fetch associated Profile
    const profile = await Profile.findById(profileId);
    // Create task from req.body and push to profile
    const newTask = new Task(req.body.task);
    await newTask.save();
    profile.tasks.push(newTask);
    await profile.save();
    res.redirect(`/profiles/${profileId}`);
  },
};
