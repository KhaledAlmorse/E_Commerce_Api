const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

/**
 * @description Add product to wishlist
 * @route  POST /api/v1/wishlist
 * @access protect/User
 */

exports.addProductToWishlist = asyncHandler(async (req, res, next) => {
  //$addToSet => Add Product to wishlist array if productId not exist
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true }
  );

  res.status(200).json({
    status: "Success",
    message: "Product added Seccessfully to your wishlist.",
    data: user.wishlist,
  });
});

/**
 * @description Delete product from wishlist
 * @route  Delete /api/v1/wishlist
 * @access protect/User
 */

exports.deleteProductFromWishlist = asyncHandler(async (req, res, next) => {
  //$pull => Remove Product From wishlist array if productId  exist
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishlist: req.params.productId },
    },
    { new: true }
  );

  res.status(200).json({
    status: "Success",
    message: "Product Removed Seccessfully From your wishlist.",
    data: user.wishlist,
  });
});

/**
 * @description Get Logged User Wishlist
 * @route  Delete /api/v1/wishlist
 * @access protect/User
 */

exports.getLoggedUserWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  res.status(200).json({
    status: "Succsess",
    results: user.wishlist.length,
    data: user.wishlist,
  });
});
