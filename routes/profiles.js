const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  createProfile,
  getProfile,
  updateProfile,
} = require("../controllers/profiles");

router.post("/", createProfile);

router.get("/:profileId", getProfile);

router.patch("/:profileId", updateProfile);

module.exports = router;
