const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const {
  submitRating,
  updateRating,
  getStoreRatings,
  getOwnerDashboard,
} = require("../controllers/rating.controller");

router.post(
  "/stores/:storeId/ratings",
  authenticate,
  authorize("USER"),
  submitRating
);

router.patch(
  "/stores/:storeId/ratings",
  authenticate,
  authorize("USER"),
  updateRating
);

router.get(
  "/stores/:storeId/ratings",
  authenticate,
  authorize("USER", "STORE_OWNER", "ADMIN"),
  getStoreRatings
);

router.get(
  "/owner/dashboard",
  authenticate,
  authorize("STORE_OWNER"),
  getOwnerDashboard
);

module.exports = router;