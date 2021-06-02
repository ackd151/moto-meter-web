const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  isLoggedIn,
  ownsProfile,
  activePage,
  getTargetId,
} = require("../middleware");
const {
  getInspections,
  postInspections,
  updateInspections,
  getInspectionsEdit,
  deleteInspections,
} = require("../controllers/inspectionsCtrl");

router.use(isLoggedIn, getTargetId, ownsProfile, activePage);

router
  .route("/")
  .get(getInspections)
  .post(postInspections)
  .patch(updateInspections);

router.get("/edit", getInspectionsEdit);

router.delete("/destroy", deleteInspections);

module.exports = router;
