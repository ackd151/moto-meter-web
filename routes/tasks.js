const express = require("express");
const router = express.Router({ mergeParams: true });
const { createTask, updateTask } = require("../controllers/tasks");

// POST "/profile/:profileId/tasks" - create new task
router.post("/", createTask);

router.patch("/:taskId", updateTask);

module.exports = router;
