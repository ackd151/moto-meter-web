const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  getHome,
  getRegister,
  postRegister,
  getLogin,
  postLogin,
  getLogout,
  getUserHome,
  createProfile,
} = require("../controllers/indexCtrl");
const passport = require("passport");
const { isLoggedIn, validateProfile } = require("../middleware/index");
const catchAsync = require("../utils/catchAsync");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router.get("/", getHome);

router.route("/register").get(getRegister).post(catchAsync(postRegister));

router
  .route("/login")
  .get(getLogin)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    catchAsync(postLogin)
  );

router.get("/logout", getLogout);

router
  .route("/:username", isLoggedIn)
  .get(catchAsync(getUserHome))
  .post(upload.single("image"), validateProfile, catchAsync(createProfile));

module.exports = router;
