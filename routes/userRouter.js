const express = require("express");
const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  ChangeUserPasswordValidator,
  updateLoggedUserValidator,
} = require("../utils/Validator/userValidator");

const {
  getUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  UploadUserImage,
  resizeImage,
  ChangeUserPassword,
  getLoggedUserData,
  UpdateLoggedUserPassword,
  UpdateLoggedUserData,
  DeleteLoggedUserData,
} = require("../services/userService");
const authService = require("../services/authService");

const router = express.Router();
router.use(authService.protect);

router.get("/GetMe", getLoggedUserData, getUser);
router.put("/ChangeMyPassword", UpdateLoggedUserPassword);
router.put("/UpdateMe", updateLoggedUserValidator, UpdateLoggedUserData);
router.delete("/DeleteMe", DeleteLoggedUserData);

router.use(authService.alloewTo("admin", "manger"));

router.put(
  "/ChangePssword/:id",
  ChangeUserPasswordValidator,
  ChangeUserPassword
);
router
  .route("/")
  .get(getUsers)
  .post(UploadUserImage, resizeImage, createUserValidator, createUser);

router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(UploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = router;
