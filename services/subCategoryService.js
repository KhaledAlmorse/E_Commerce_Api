const Factory = require("./handlersFactory");
const subCategoryModel = require("../models/subCategoryModel");

exports.setCategoryIdToBoady = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

// Nested route
// GET /api/v1/categories/:categoryId/subcategories
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};

/**
 * @description Create subCategory
 * @route  POST /api/v1/subcategories
 * @access Private
 */
exports.createSubCategories = Factory.createOne(subCategoryModel);

// Get /api/v1/categories/:categoryId/subcategories
/**
 * @description Get List subCategories
 * @route  Get /api/v1/subcategories
 * @access Public
 */

exports.getSubCategories = Factory.getAll(subCategoryModel);

/**
 * @description Get specific subCategory by  id
 * @route  Get /api/v1/subcategories/:id
 * @access Public
 */

exports.getSubCategory = Factory.getOne(subCategoryModel);
/**
 * @description Update subCategory by id
 * @route  Put /api/v1/subcategories/:id
 * @access Private
 */

exports.updateSubCategory = Factory.updateOne(subCategoryModel);
/**
 * @description Delete subCategory by id
 * @route  delete /api/v1/subcategories/:id
 * @access Private deleteSubCatergory
 */

exports.deleteSubCatergory = Factory.deleteOne(subCategoryModel);
