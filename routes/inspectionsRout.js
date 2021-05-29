const express = require("express");
const router = express.Router({ mergeParams: true });
const { ownsProfile, activePage } = require("../middleware/index");
const {
  getInspections,
  postInspections,
  updateInspections,
  getInspectionsEdit,
  deleteInspections,
} = require("../controllers/inspectionsCtrl");

// const { isLoggedIn, ownsProfile, activePage } = require("../middleware/index");

router.use(ownsProfile, activePage);

router
  .route("/")
  .get(getInspections)
  .post(postInspections)
  .patch(updateInspections);

router.get("/edit", getInspectionsEdit);

router.delete("/destroy", deleteInspections);

module.exports = router;
