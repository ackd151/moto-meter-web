const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  createProfile,
  getProfile,
  updateProfile,
} = require("../controllers/profiles");
const catchAsync = require("../utils/catchAsync");

router.post("/", catchAsync(createProfile));

router.get("/:profileId", catchAsync(getProfile));

router.patch("/:profileId", catchAsync(updateProfile));

module.exports = router;
