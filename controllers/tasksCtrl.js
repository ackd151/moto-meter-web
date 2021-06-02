const Profile = require("../models/profileModel");
const Task = require("../models/taskModel");
const compareTasks = require("../utils/compareTasks");

module.exports = {
  async getTaskPage(req, res, next) {
    const profile = await Profile.findById(req.targetId).populate("tasks");
    // Sort tasks
    const { tasks } = profile;
    for (const task of tasks) {
      task.remainingHours = await task.getRemainingHours();
    }
    tasks.sort(compareTasks);
    res.render("pages/maintenance", { profile });
  },
  async createTask(req, res, next) {
    // Fetch associated Profile
    const profile = await Profile.findById(req.targetId);
    // Create task from req.body and push to profile
    const newTask = new Task(req.body.task);
    await newTask.save();
    profile.tasks.push(newTask);
    await profile.save();
    req.flash("success", "New maintenance task added.");
    res.redirect(`/${req.user.username}/garage/${profile.url}/maintenance`);
  },
  async updateTask(req, res, next) {
    const profile = await Profile.findById(req.targetId);
    const { title, lastCompletedAt, interval } = req.body.task;
    const task = await Task.findById(req.params.taskId);
    task.title = title || task.title;
    task.interval = interval || task.interval;
    task.lastCompletedAt = lastCompletedAt || task.lastCompletedAt;
    await task.save();
    res.redirect(`/${req.user.username}/garage/${profile.url}/maintenance`);
  },
  async deleteTask(req, res, next) {
    const profile = await Profile.findByIdAndUpdate(req.params.profileId, {
      $pull: { tasks: req.params.taskId },
    });
    await Task.findByIdAndDelete(req.params.taskId);
    res.redirect(`/${req.user.username}/garage/${profile.url}/maintenance`);
  },
};
