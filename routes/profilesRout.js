const express = require("express");
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
  validateProfile,
} = require("../middleware");
const catchAsync = require("../utils/catchAsync");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router.use(activePage, isLoggedIn, getTargetId, ownsProfile);

router
  .route("/")
  .get(catchAsync(getProfile))
  .patch(upload.single("image"), validateProfile, catchAsync(updateProfile))
  .delete(catchAsync(deleteProfile));

router.get("/post-ride", catchAsync(getPostRide));

module.exports = router;
