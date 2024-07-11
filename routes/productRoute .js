const express = require("express");
const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/Validator/productValidator");

const {
  getProducts,
  getProduct,
  createProducts,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  resizeProductImages,
} = require("../services/productService");

const router = express.Router();
const authService = require("../services/authService");

const ReviewRoute = require("./reviewRouter");

router.use("/:productId/reviews", ReviewRoute);

router
  .route("/")
  .get(getProducts)
  .post(
    authService.protect,
    authService.alloewTo("admin", "manger"),
    uploadProductImages,
    resizeProductImages,
    createProductValidator,
    createProducts
  );

router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    authService.protect,
    authService.alloewTo("admin", "manger"),
    uploadProductImages,
    resizeProductImages,
    updateProductValidator,
    updateProduct
  )
  .delete(
    authService.protect,
    authService.alloewTo("admin"),
    deleteProductValidator,
    deleteProduct
  );

module.exports = router;
