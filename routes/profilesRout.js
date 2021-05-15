const express = require("express");
const { get } = require("mongoose");
const router = express.Router({ mergeParams: true });
const {
  createProfile,
  getProfile,
  updateProfile,
  getPostRide,
} = require("../controllers/profilesCtrl");
const { isLoggedIn, ownsProfile, activePage } = require("../middleware/index");
const catchAsync = require("../utils/catchAsync");

router.use(activePage, isLoggedIn);

router.post("/", catchAsync(createProfile));

router.get("/:profileId", ownsProfile, catchAsync(getProfile));
router.get("/:profileId/post-ride", ownsProfile, getPostRide);

router.patch("/:profileId", catchAsync(updateProfile));

module.exports = router;
