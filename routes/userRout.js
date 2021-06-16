const express = require("express");
const router = express.Router({ mergeParams: true });
const { getUserHome, createProfile } = require("../controllers/userCtrl");
const { isLoggedIn, validateProfile } = require("../middleware/index");
const catchAsync = require("../utils/catchAsync");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
  .route("/", isLoggedIn)
  .get(catchAsync(getUserHome))
  .post(upload.single("image"), validateProfile, catchAsync(createProfile));

module.exports = router;
