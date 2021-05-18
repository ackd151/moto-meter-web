const Profile = require("../models/profileModel");
const Task = require("../models/taskModel");
const compareTasks = require("../utils/compareTasks");

module.exports = {
  async getTaskPage(req, res, next) {
    const { profileId } = req.params;
    const profile = await Profile.findById(profileId).populate("tasks");
    // Sort tasks
    const { tasks } = profile;
    for (const task of tasks) {
      task.remainingHours = await task.getRemainingHours();
    }
    tasks.sort(compareTasks);
    res.render("pages/maintenance", { profile });
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
    res.redirect(
      `/home/${req.user.username}/profiles/${profileId}/maintenance`
    );
  },
  async updateTask(req, res, next) {
    const { lastCompletedAt, interval } = req.body;
    const task = await Task.findById(req.params.taskId);
    task.interval = interval || task.interval;
    task.lastCompletedAt = lastCompletedAt || task.lastCompletedAt;
    await task.save();
    res.redirect(`/profiles/${req.params.profileId}/maintenance`);
  },
};
