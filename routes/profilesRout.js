const express = require("express");
const { get } = require("mongoose");
const router = express.Router({ mergeParams: true });
const {
  createProfile,
  getProfile,
  updateProfile,
  getPostRide,
  deleteProfile,
} = require("../controllers/profilesCtrl");
const {
  isLoggedIn,
  ownsProfile,
  activePage,
  getTargetId,
} = require("../middleware");
const catchAsync = require("../utils/catchAsync");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router.use(activePage, isLoggedIn);

// move to user routes/ctrl
router.post("/", upload.single("image"), catchAsync(createProfile));

router.get("/:profileUrl", getTargetId, ownsProfile, catchAsync(getProfile));

router.patch(
  "/:profileUrl",
  getTargetId,
  ownsProfile,
  upload.single("image"),
  catchAsync(updateProfile)
);
router.delete(
  "/:profileUrl",
  getTargetId,
  ownsProfile,
  catchAsync(deleteProfile)
);

router.get(
  "/:profileUrl/post-ride",
  getTargetId,
  ownsProfile,
  catchAsync(getPostRide)
);

module.exports = router;
