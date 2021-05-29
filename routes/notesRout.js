const express = require("express");
const router = express.Router({ mergeParams: true });
const { getNotes, postNotes } = require("../controllers/notesCtrl");
const catchAsync = require("../utils/catchAsync");
const { ownsProfile, activePage } = require("../middleware/index");

router.use(ownsProfile, activePage);

router.route("/").get(catchAsync(getNotes)).post(catchAsync(postNotes));

module.exports = router;
