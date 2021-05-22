const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  createTask,
  updateTask,
  getTaskPage,
  deleteTask,
} = require("../controllers/tasksCtrl");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, ownsProfile } = require("../middleware/index");

router.use(isLoggedIn, ownsProfile);

router.route("/").get(catchAsync(getTaskPage)).post(catchAsync(createTask));

router
  .route("/:taskId")
  .patch(catchAsync(updateTask))
  .delete(catchAsync(deleteTask));

module.exports = router;
