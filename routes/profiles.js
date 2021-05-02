const express = require("express");
const router = express.Router({ mergeParams: true });
const { createProfile, getProfile } = require("../controllers/profiles");

router.post("/", createProfile);

router.get("/:profileId", getProfile);

module.exports = router;
