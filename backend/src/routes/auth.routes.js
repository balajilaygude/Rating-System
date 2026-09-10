const express = require("express");

const router = express.Router();

const {
  registerUser,
  loginUser,
  changePassword,
  logoutUser,
} = require("../controllers/auth.controller");

const authenticate = require("../middleware/auth.middleware");

const validate = require("../middleware/validation.middleware");

const {
  signupValidation,
  loginValidation,
  changePasswordValidation,
} = require("../validators/auth.validator");

router.post(
  "/signup",
  signupValidation,
  validate,
  registerUser
);

router.post(
  "/login",
  loginValidation,
  validate,
  loginUser
);

router.patch(
  "/password",
  authenticate,
  changePasswordValidation,
  validate,
  changePassword
);

router.post(
  "/logout",
  authenticate,
  logoutUser
);

module.exports = router;