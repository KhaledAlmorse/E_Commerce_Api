const express = require("express");
const router = express.Router();
const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/Validator/brandValidator");

const {
  getBrands,
  createBrands,
  getBrand,
  updateBrands,
  deleteBrand,
  UploadBrandImage,
  resizeImage,
} = require("../services/brandService");
const authService = require("../services/authService");

router
  .route("/")
  .get(getBrands)
  .post(
    authService.protect,
    authService.alloewTo("admin", "manger"),
    UploadBrandImage,
    resizeImage,
    createBrandValidator,
    createBrands
  );

router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(
    authService.protect,
    authService.alloewTo("admin", "manger"),
    UploadBrandImage,
    resizeImage,
    updateBrandValidator,
    updateBrands
  )
  .delete(
    authService.protect,
    authService.alloewTo("admin"),
    deleteBrandValidator,
    deleteBrand
  );

module.exports = router;
