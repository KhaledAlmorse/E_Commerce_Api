const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const Factory = require("./handlersFactory");
const CategoryModel = require("../models/categroyModel");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

exports.UploadCategoryImage = uploadSingleImage("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `Category-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 98 })
      .toFile(`uploads/categories/${filename}`);

    //Save Imge In Our DB
    req.body.image = filename;
  }

  next();
});

/**
 * @description Get List Categories
 * @route  Get /api/v1/categories
 * @access Public
 */
exports.getCategories = Factory.getAll(CategoryModel);

/**
 * @description Get specific Category by  id
 * @route  Get /api/v1/categories/:id
 * @access Public
 */
exports.getCategory = Factory.getOne(CategoryModel);

/**
 * @description Create Category
 * @route  POST /api/v1/categories
 * @access Private
 */
exports.createCategory = Factory.createOne(CategoryModel);
/**
 * @description Update Category by id
 * @route  Put /api/v1/categories/:id
 * @access Private
 */
exports.updateCatergory = Factory.updateOne(CategoryModel);

/**
 * @description Delete Category by id
 * @route  delete /api/v1/categories/:id
 * @access Private
 */
exports.deleteCatergory = Factory.deleteOne(CategoryModel);
