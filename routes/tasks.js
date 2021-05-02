const express = require("express");
const router = express.Router({ mergeParams: true });
const { createTask } = require("../controllers/tasks");

// POST "/profile/:profileId/tasks" - create new task
router.post("/", createTask);

module.exports = router;
