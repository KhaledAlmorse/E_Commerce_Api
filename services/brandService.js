const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const Factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const BrandModel = require("../models/brandModel");

exports.UploadBrandImage = uploadSingleImage("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `Brand-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 98 })
    .toFile(`uploads/Brands/${filename}`);

  //Save Imge In Our DB
  req.body.image = filename;
  next();
});
/**
 * @description Get List Brands
 * @route  Get /api/v1/brands
 * @access Public
 */
exports.getBrands = Factory.getAll(BrandModel);

/**
 * @description Get specific Brand by  id
 * @route  Get /api/v1/brands/:id
 * @access Public
 */
exports.getBrand = Factory.getOne(BrandModel);

/**
 * @description Create Brand
 * @route  POST /api/v1/brands
 * @access Private
 */
exports.createBrands = Factory.createOne(BrandModel);
/**
 * @description Update Brand by id
 * @route  Put /api/v1/brands/:id
 * @access Private
 */
exports.updateBrands = Factory.updateOne(BrandModel);

/**
 * @description Delete Brand by id
 * @route  delete /api/v1/brands/:id
 * @access Private
 */

exports.deleteBrand = Factory.deleteOne(BrandModel);
