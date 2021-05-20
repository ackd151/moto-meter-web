const express = require("express");
const router = express.Router({ mergeParams: true });
const { getNotes, postNotes } = require("../controllers/notesCtrl");
const catchAsync = require("../utils/catchAsync");
const { activePage } = require("../middleware/index");

router.use(activePage);

router.route("/").get(catchAsync(getNotes)).post(catchAsync(postNotes));

module.exports = router;
