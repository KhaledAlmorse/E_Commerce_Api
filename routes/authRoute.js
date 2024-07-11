const express = require("express");
const {
  singupValidator,
  loginValidator,
} = require("../utils/Validator/authValiditor");

const {
  singup,
  login,
  forgetPassword,
  verifyPassworResetCode,
  resetPassword,
} = require("../services/authService");

const router = express.Router();

router.post("/singup", singupValidator, singup);
router.post("/login", loginValidator, login);
router.post("/forgotPassword", forgetPassword);
router.post("/VerifyResetCode", verifyPassworResetCode);
router.put("/ResetPassword", resetPassword);
module.exports = router;
