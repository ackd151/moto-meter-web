const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  createTask,
  updateTask,
  getTaskPage,
  deleteTask,
} = require("../controllers/tasksCtrl");
const catchAsync = require("../utils/catchAsync");
const {
  isLoggedIn,
  getTargetId,
  ownsProfile,
  activePage,
} = require("../middleware");

router.use(isLoggedIn, getTargetId, ownsProfile, activePage);

router.route("/").get(catchAsync(getTaskPage)).post(catchAsync(createTask));

router
  .route("/:taskId")
  .patch(catchAsync(updateTask))
  .delete(catchAsync(deleteTask));

module.exports = router;
