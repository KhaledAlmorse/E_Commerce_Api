const crypto = require("crypto");

var jwt = require("jsonwebtoken");
const bycrpt = require("bcryptjs");

const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const User = require("../models/userModel");
const { header } = require("express-validator");
const sendEmail = require("../utils/sentEmail");

const createToken = require("../utils/CreateToken");

/**
 * @description singup
 * @route  POST /api/auth/singup
 * @access pubic
 */
exports.singup = asyncHandler(async (req, res, next) => {
  //1-Create User
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  //2-Genreate Token
  const token = createToken(user._id);

  res.status(201).json({ data: user, token });
});

exports.login = asyncHandler(async (req, res, next) => {
  //1-) check password and email in (validiator)
  //2-) check password is exist & if password is correct
  const user = await User.findOne({ email: req.body.email });

  if (!user || !(await bycrpt.compare(req.body.password, user.password))) {
    return next(new ApiError("Incorrect email or password", 404));
  }
  //-3)generate token
  const token = createToken(user._id);
  //-4)send response to client side
  res.status(200).json({ data: user, token });
});
/**
 * @description Make sure the user is logged in
 */
exports.protect = asyncHandler(async (req, res, next) => {
  //1-) check if token exist, if exist get the token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    console.log(token);
  }

  if (!token) {
    return next(
      new ApiError(
        "Your are not login, please login to access this route ",
        401
      )
    );
  }
  //2-)verfiy token (no change happens, expired token)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  //3-)check if user exist
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError(
        "the user that belong to this token does no longer exist",
        401
      )
    );
  }
  //4-)check if user change his password after token created
  if (currentUser.passwordChangedAt) {
    const passwordChangeTimesstamps = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    if (passwordChangeTimesstamps > decoded.iat) {
      return next(
        new ApiError(
          "user recentely changed his password, please login again ",
          401
        )
      );
    }
  }
  req.user = currentUser;
  next();
});
/**
 * @description Authorization (User Permissions)
 * */
// ["admin", "manger"]
exports.alloewTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    //1- access role
    //2-access register user(req.user.role)
    if (!roles.includes(req.user.role)) {
      return next(new ApiError("You are not allow to access this route"), 403);
    }
    next();
  });

/**
 * @description Forget Password
 * @route  POST /api/auth/forgetPassword
 * @access pubic
 */
exports.forgetPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`There is no user with that email ${req.body.email}`, 404)
    );
  }
  // 2) If user exist, Generate hash reset random 6 digits and save it in db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  // Save hashed password reset code into db
  user.passwordResetCode = hashedResetCode;
  // Add expiration time for password reset code (10 min)
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();

  // 3) Send the reset code via email
  const message = `Hi ${user.name},\n We received a request to reset the password on your E-shop Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The E-shop Team`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset code (valid for 10 min)",
      message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();
    return next(new ApiError("There is an error in sending email", 500));
  }

  res
    .status(200)
    .json({ status: "Success", message: "Reset code sent to email" });
});

/**
 * @description Verify Password Reset code
 * @route  POST /api/auth/VerifyResetCode
 * @access pubic
 */
exports.verifyPassworResetCode = asyncHandler(async (req, res, next) => {
  //1-) Get user based on reset code
  if (!req.body.resetCode) {
    return next(new ApiError("Reset code is required", 400));
  }

  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError("Reset Code invalid or expired"));
  }

  //2-)Reset Code Valid
  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({
    status: "Success",
  });
});

/**
 * @description Reset Paaword
 * @route  POST /api/auth/ResetPassword
 * @access pubic
 */

exports.resetPassword = asyncHandler(async (req, res, next) => {
  //1)get User Based on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("Ther is no User For This email"), 404);
  }
  //2) Check Reset Code Verified
  if (!user.passwordResetVerified) {
    return next(new ApiError("Reset code not verify"), 400);
  }

  user.password = req.body.newpass;

  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save();
  //3)if every thing is okay generate token
  const token = createToken(user._id);
  res.status(200).json({ token });
});
