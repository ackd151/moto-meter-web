const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  createTask,
  updateTask,
  getTaskPage,
} = require("../controllers/tasksCtrl");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn } = require("../middleware/index");

router.get("/", isLoggedIn, catchAsync(getTaskPage));

router.post("/", isLoggedIn, catchAsync(createTask));

router.patch("/:taskId", isLoggedIn, catchAsync(updateTask));

module.exports = router;
