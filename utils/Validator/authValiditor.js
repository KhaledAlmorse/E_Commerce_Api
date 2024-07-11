const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware.js");
const slugify = require("slugify");
const User = require("../../models/userModel.js");

exports.singupValidator = [
  check("name")
    .notEmpty()
    .withMessage("User Required")
    .isLength({ min: 3 })
    .withMessage("Too Short User Name"),
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  check("email")
    .notEmpty()
    .withMessage("Email Required")
    .isEmail()
    .withMessage("Invalid Email Address")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email alerady in Uer"));
        }
      })
    ),
  check("password")
    .notEmpty()
    .withMessage("PassWord required")
    .isLength({ min: 6 })
    .withMessage("password must at least 6 characters")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error("Password Confirmation Is InCorrect");
      }
      return true;
    }),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password Confirmation Is Required"),

  validatorMiddleware,
];

exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email Required")
    .isEmail()
    .withMessage("Invalid Email Address"),

  check("password")
    .notEmpty()
    .withMessage("PassWord required")
    .isLength({ min: 6 })
    .withMessage("password must at least 6 characters"),

  validatorMiddleware,
];
