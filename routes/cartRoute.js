const express = require("express");
const router = express.Router();

const {
  addProductToCarts,
  getLoggedUserCart,
  removeSpecificCartItem,
  clearCart,
  updateCartItemQuantity,
  applyCoupon,
} = require("../services/cartService");
const authService = require("../services/authService");

router.use(authService.protect, authService.alloewTo("user"));

router
  .route("/")
  .post(addProductToCarts)
  .get(getLoggedUserCart)
  .delete(clearCart);

router.put("/applyCoupon", applyCoupon);

router
  .route("/:itemId")
  .delete(removeSpecificCartItem)
  .put(updateCartItemQuantity);

module.exports = router;
