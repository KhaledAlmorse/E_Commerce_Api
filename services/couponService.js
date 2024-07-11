const Factory = require("./handlersFactory");
const Coupon = require("../models/couponModel");

/**
 * @description Get List Coupons
 * @route  Get /api/v1/Coupons
 * @access Private/admin/manger
 */
exports.getCoupons = Factory.getAll(Coupon);

/**
 * @description Get specific Coupon by  id
 * @route  Get /api/v1/Coupons/:id
 * @access Private/admin/manger
 */
exports.getCoupon = Factory.getOne(Coupon);

/**
 * @description Create Coupon
 * @route  POST /api/v1/Coupons
 * @access Private/admin/manger
 */
exports.createCoupon = Factory.createOne(Coupon);
/**
 * @description Update Coupon by id
 * @route  Put /api/v1/Coupons/:id
 * @access Private/admin/manger
 */
exports.updateCoupon = Factory.updateOne(Coupon);

/**
 * @description Delete Coupon by id
 * @route  delete /api/v1/Coupons/:id
 * @access Private/admin/manger
 */

exports.deleteCoupon = Factory.deleteOne(Coupon);
