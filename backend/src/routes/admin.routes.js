const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");
const validate = require("../middleware/validation.middleware");

const {
  createUserValidation,
  createStoreValidation,
} = require("../validators/user.validator");

const {
  getDashboard,
  createUser,
  getUsers,
  getUserById,
  createStore,
  getStores,
} = require("../controllers/admin.controller");

router.use(authenticate);
router.use(authorize("ADMIN"));

router.get("/dashboard", getDashboard);

router.post(
  "/users",
  createUserValidation,
  validate,
  createUser
);

router.get("/users", getUsers);

router.get("/users/:id", getUserById);

router.post(
  "/stores",
  createStoreValidation,
  validate,
  createStore
);

router.get("/stores", getStores);

module.exports = router;