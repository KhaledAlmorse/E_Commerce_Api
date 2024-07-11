const express = require("express");

const authService = require("../services/authService");
const {
  addAddress,
  deleteAddress,
  getLoggedUserAdressList,
} = require("../services/addresService");

const router = express.Router();

router.use(authService.protect, authService.alloewTo("user"));

router.route("/").post(addAddress).get(getLoggedUserAdressList);

router.delete("/:addressId", deleteAddress);

module.exports = router;
