const { body } = require("express-validator");

const passwordRule =
  /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

const signupValidation = [
  body("name")
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage("Name must be between 20 and 60 characters"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email"),

  body("address")
    .trim()
    .isLength({ max: 400 })
    .withMessage("Address cannot exceed 400 characters"),

  body("password")
    .matches(passwordRule)
    .withMessage(
      "Password must be 8-16 characters and contain at least one uppercase letter and one special character"
    ),
];

const loginValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email"),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

const changePasswordValidation = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),

  body("newPassword")
    .matches(passwordRule)
    .withMessage(
      "New password must be 8-16 characters and contain at least one uppercase letter and one special character"
    ),
];

module.exports = {
  signupValidation,
  loginValidation,
  changePasswordValidation,
};