const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const slugify = require("slugify");
const User = require("../../models/userModel.js");
const bcrypt = require("bcryptjs");

exports.createUserValidator = [
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

  check("profileImg").optional(),
  check("role").optional(),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Only Egy & SA Phone Number"),

  validatorMiddleware,
];
exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already in user"));
        }
      })
    ),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number only accepted Egy and SA Phone numbers"),

  check("profileImg").optional(),
  check("role").optional(),
  validatorMiddleware,
];

exports.ChangeUserPasswordValidator = [
  check("id").isMongoId().withMessage("Invalid User Id Format"),
  body("CurrentPassword")
    .notEmpty()
    .withMessage("You must enter your current password"),
  body("passwordConfirm")
    .notEmpty()
    .withMessage("You must enter your the password confirm"),
  body("password")
    .notEmpty()
    .withMessage("you must enter new passwprd")
    .custom(async (val, { req }) => {
      //1) Verify Current Password
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error("There is no user for this id ");
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.CurrentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error("InCorrect Current Password");
      }

      if (val !== req.body.passwordConfirm) {
        throw new Error("Password Confirmation Is InCorrect");
      }
      return true;
    }),
  validatorMiddleware,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  validatorMiddleware,
];

exports.updateLoggedUserValidator = [
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already in user"));
        }
      })
    ),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number only accepted Egy and SA Phone numbers"),

  validatorMiddleware,
];
