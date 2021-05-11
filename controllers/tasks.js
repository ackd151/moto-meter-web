const Profile = require("../models/profile");
const Task = require("../models/task");

module.exports = {
  async getTaskPage(req, res, next) {
    const { profileId } = req.params;
    // Fetch associated Profile
    const profile = await (await Profile.findById(profileId)).populate("tasks");
    res.render("pages/maintenance", { profile, url: req.originalUrl });
  },
  async createTask(req, res, next) {
    const { profileId } = req.params;
    // Fetch associated Profile
    const profile = await Profile.findById(profileId);
    // Create task from req.body and push to profile
    const newTask = new Task(req.body.task);
    await newTask.save();
    profile.tasks.push(newTask);
    await profile.save();
    req.flash("success", "New maintenance task added.");
    res.redirect(`/profiles/${profileId}`);
  },
  async updateTask(req, res, next) {
    await Task.findByIdAndUpdate(req.params.taskId, {
      lastCompletedAt: req.body.newHours,
    });
    res.redirect(`/profiles/${req.params.profileId}`);
  },
};
