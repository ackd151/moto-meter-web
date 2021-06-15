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
  validateTask,
} = require("../middleware");

router.use(isLoggedIn, getTargetId, ownsProfile, activePage);

router
  .route("/")
  .get(catchAsync(getTaskPage))
  .post(validateTask, catchAsync(createTask));

router
  .route("/:taskId")
  .patch(validateTask, catchAsync(updateTask))
  .delete(catchAsync(deleteTask));

module.exports = router;
