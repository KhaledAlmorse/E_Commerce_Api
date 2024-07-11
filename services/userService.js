const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const bcrypt = require("bcryptjs");

const Factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const UserModel = require("../models/userModel");
const ApiError = require("../utils/apiError");
const createToken = require("../utils/CreateToken");

exports.UploadUserImage = uploadSingleImage("profileImg");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `User-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 98 })
      .toFile(`uploads/Users/${filename}`);

    //Save Imge In Our DB
    req.body.profileImg = filename;
  }

  next();
});
/**
 * @description Get List Users
 * @route  Get /api/v1/users
 * @access Public
 */
exports.getUsers = Factory.getAll(UserModel);

/**
 * @description Get specific User by  id
 * @route  Get /api/v1/users/:id
 * @access Public
 */
exports.getUser = Factory.getOne(UserModel);

/**
 * @description Create User
 * @route  POST /api/v1/users
 * @access Private
 */
exports.createUser = Factory.createOne(UserModel);
/**
 * @description Update User by id
 * @route  Put /api/v1/users/:id
 * @access Private
 */
exports.updateUser = asyncHandler(async (req, res, next) => {
  const document = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      slug: req.body.slug,
      phone: req.body.phone,
      profileImg: req.body.profileImg,
      active: req.body.active,
      role: req.body.role,
    },
    {
      new: true,
    }
  );
  if (!document) {
    return next(new ApiError(`No document For This id ${id}`, 404));
  }
  res.status(200).json({ data: document });
});

exports.ChangeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  if (!document) {
    return next(new ApiError(`No document For This id ${id}`, 404));
  }
  res.status(200).json({ data: document });
});
/**
 * @description Delete User by id
 * @route  delete /api/v1/users/:id
 * @access Private
 */
exports.deleteUser = Factory.deleteOne(UserModel);

/**
 * @description  Get Logged user data
 * @route  POST /api/users/GetMe
 * @access private/protect
 */
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

/**
 * @description  Update Logged user Password
 * @route  Put /api/users/UpdateMyPassword
 * @access private/protect
 */
exports.UpdateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  //1) update user password based on payload(req.user._id)
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  //2)generate token
  const token = createToken(user._id);

  res.status(200).json({ data: user, token });
});

/**
 * @description  Update Logged user data (Without password , rule)
 * @route  Put /api/users/UpdateMe
 * @access private/protect
 */
exports.UpdateLoggedUserData = asyncHandler(async (req, res, next) => {
  const updatedUser = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    { new: true }
  );
  res.status(200).json({ data: updatedUser });
});

/**
 * @description  Deactivate Logged user
 * @route  Delete /api/users/DeleteMe
 * @access private/protect
 */
exports.DeleteLoggedUserData = asyncHandler(async (req, res, next) => {
  await UserModel.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({ status: "Success" });
});
