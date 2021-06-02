const express = require("express");
const router = express.Router({ mergeParams: true });
const { getNotes, postNotes } = require("../controllers/notesCtrl");
const catchAsync = require("../utils/catchAsync");
const {
  isLoggedIn,
  ownsProfile,
  activePage,
  getTargetId,
} = require("../middleware/index");

router.use(isLoggedIn, getTargetId, ownsProfile, activePage);

router.route("/").get(catchAsync(getNotes)).post(catchAsync(postNotes));

module.exports = router;
