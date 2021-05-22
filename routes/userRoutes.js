const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/index");
const User = require("../models/userModel");
const Inspection = require("../models/inspectionModel");
const compareTasks = require("../utils/compareTasks");

router.get("/:username", isLoggedIn, async (req, res, next) => {
  const user = await User.findOne({ username: req.params.username }).populate({
    path: "bikeProfiles",
    populate: { path: "tasks" },
  });
  // Sort profile tasks, populate remainingHours on each, and get pre-ride status
  for (const [index, profile] of user.bikeProfiles.entries()) {
    const { tasks } = profile;
    // Calculate remaining hours
    for (const task of tasks) {
      task.remainingHours = await task.getRemainingHours();
    }
    // Sort
    tasks.sort(compareTasks);
    // Get pre-ride status
    profile.completed = await Inspection.inspectionsComplete(profile._id);
  }
  res.render("users/userHome", { user });
});

module.exports = router;
