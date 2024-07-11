const express = require("express");

const authService = require("../services/authService");
const {
  addProductToWishlist,
  deleteProductFromWishlist,
  getLoggedUserWishlist,
} = require("../services/wishlistService");

const router = express.Router();

router.use(authService.protect, authService.alloewTo("user"));

router.route("/").post(addProductToWishlist).get(getLoggedUserWishlist);

router.delete("/:productId", deleteProductFromWishlist);

module.exports = router;
