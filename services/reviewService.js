const Factory = require("./handlersFactory");
const Review = require("../models/reviewModel");

// Nested Route
// Get /api/v1/products/:productId/reviews
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) filterObject = { product: req.params.productId };
  req.filterObj = filterObject;
  next();
};

/**
 * @description Get List Reviews
 * @route  Get /api/v1/reviews
 * @access Public
 */
exports.getReviews = Factory.getAll(Review);

/**
 * @description Get specific Review by id
 * @route  Get /api/v1/reviews/:id
 * @access Public
 */
exports.getReview = Factory.getOne(Review);

//Nested Route (Create)
exports.setProductIdAndUserIdToBoady = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};
/**
 * @description Create Review
 * @route  POST /api/v1/reviews
 * @access Private/protect/User
 */
exports.createReview = Factory.createOne(Review);

/**
 *
 * @description Update Review by id
 * @route  Put /api/v1/reviews/:id
 * @access Private/protect/User
 */
exports.updateReview = Factory.updateOne(Review);

/**
 * @description Delete Review by id
 * @route  delete /api/v1/reviews/:id
 * @access Private/protect/User-admin-manger
 */
exports.deleteReview = Factory.deleteOne(Review);
