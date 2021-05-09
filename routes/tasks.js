const express = require("express");
const router = express.Router({ mergeParams: true });
const { createTask, updateTask } = require("../controllers/tasks");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn } = require("../middleware/index");

// POST "/profile/:profileId/tasks" - create new task
router.post("/", isLoggedIn, catchAsync(createTask));

router.patch("/:taskId", isLoggedIn, catchAsync(updateTask));

module.exports = router;
