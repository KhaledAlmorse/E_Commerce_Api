const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.addProductToWishlistValiditor = [
  check("wishlist").optional(),
  check("id").isMongoId().withMessage("Invalid Brand id format"),
  validatorMiddleware,
];
