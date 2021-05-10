const express = require("express");
const router = express.Router({ mergeParams: true });
const { createTask, updateTask, getTaskPage } = require("../controllers/tasks");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn } = require("../middleware/index");

// GET "/profile/:profileId/maintenance" - render maintenance page
router.get("/", isLoggedIn, catchAsync(getTaskPage));

// POST "/profile/:profileId/maintenance" - create new task
router.post("/", isLoggedIn, catchAsync(createTask));

router.patch("/:taskId", isLoggedIn, catchAsync(updateTask));

module.exports = router;
