const express = require("express");
const router = express.Router({ mergeParams: true });
const { createTask, updateTask } = require("../controllers/tasks");
const catchAsync = require("../utils/catchAsync");

// POST "/profile/:profileId/tasks" - create new task
router.post("/", catchAsync(createTask));

router.patch("/:taskId", catchAsync(updateTask));

module.exports = router;
