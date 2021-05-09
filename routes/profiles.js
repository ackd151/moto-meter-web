const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  createProfile,
  getProfile,
  updateProfile,
} = require("../controllers/profiles");
const { isLoggedIn } = require("../middleware/index");
const catchAsync = require("../utils/catchAsync");

router.post("/", isLoggedIn, catchAsync(createProfile));

router.get("/:profileId", isLoggedIn, catchAsync(getProfile));

router.patch("/:profileId", isLoggedIn, catchAsync(updateProfile));

module.exports = router;
