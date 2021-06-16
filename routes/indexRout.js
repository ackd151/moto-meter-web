const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  getHome,
  getRegister,
  postRegister,
  getLogin,
  postLogin,
  getLogout,
} = require("../controllers/indexCtrl");
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");

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

module.exports = router;
