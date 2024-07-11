const express = require("express");

const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/Validator/categoryValidator");

const {
  getCategories,
  createCategory,
  getCategory,
  updateCatergory,
  deleteCatergory,
  UploadCategoryImage,
  resizeImage,
} = require("../services/categoryService");

const authService = require("../services/authService");

const subcategoriesRoute = require("./subCategoryRoute");

const router = express.Router();
//Nested Route
router.use("/:categoryId/subcategories", subcategoriesRoute);

router
  .route("/")
  .get(getCategories)
  .post(
    authService.protect,
    authService.alloewTo("admin", "manger"),
    UploadCategoryImage,
    resizeImage,
    createCategoryValidator,
    createCategory
  );

router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    authService.protect,
    authService.alloewTo("admin", "manger"),
    UploadCategoryImage,
    resizeImage,
    updateCategoryValidator,
    updateCatergory
  )
  .delete(
    authService.protect,
    authService.alloewTo("admin"),
    deleteCategoryValidator,
    deleteCatergory
  );

module.exports = router;
