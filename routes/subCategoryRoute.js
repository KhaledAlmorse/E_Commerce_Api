const express = require("express");

const {
  createSubCategories,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCatergory,
  setCategoryIdToBoady,
  createFilterObj,
} = require("../services/subCategoryService");
const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/Validator/subCategoryValidator ");

const authService = require("../services/authService");

//mergeParams allow us to access parameters on other routers
//ex we need to access  caregoryId from Catergory Router
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    authService.protect,
    authService.alloewTo("admin", "manger"),
    setCategoryIdToBoady,
    createSubCategoryValidator,
    createSubCategories
  )
  .get(createFilterObj, getSubCategories);

router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .put(
    authService.protect,
    authService.alloewTo("admin", "manger"),
    updateSubCategoryValidator,
    updateSubCategory
  )
  .delete(
    authService.protect,
    authService.alloewTo("admin"),
    deleteSubCategoryValidator,
    deleteSubCatergory
  );

module.exports = router;
