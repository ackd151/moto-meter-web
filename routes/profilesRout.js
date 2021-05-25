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
const { isLoggedIn, ownsProfile, activePage } = require("../middleware/index");
const catchAsync = require("../utils/catchAsync");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router.use(activePage, isLoggedIn);

// move to user routes/ctrl
router.post("/", upload.single("image"), catchAsync(createProfile));

router.get("/:profileId", ownsProfile, catchAsync(getProfile));
router.patch(
  "/:profileId",
  ownsProfile,
  upload.single("image"),
  catchAsync(updateProfile)
);
router.delete("/:profileId", ownsProfile, catchAsync(deleteProfile));

router.get("/:profileId/post-ride", ownsProfile, getPostRide);

module.exports = router;
