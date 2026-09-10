const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const {
  getStores,
  getStoreById,
} = require("../controllers/store.controller");

router.get(
  "/",
  authenticate,
  authorize("USER"),
  getStores
);

router.get(
  "/:id",
  authenticate,
  authorize("USER"),
  getStoreById
);

module.exports = router;