const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

const Coupon = require("../models/couponModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

const calcTotalCartPrice = (cart) => {
  //calculate total cost price
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });
  cart.totalCartprice = totalPrice;
  cart.totalPriceAfterDiscount = undefined;
  return totalPrice;
};

/**
 * @description add Product to cart
 * @route  POST /api/v1/carts
 * @access Private/user
 */
exports.addProductToCarts = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;
  const product = await Product.findById(productId);
  //1- get carts from logged user
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    // create cart for logged user with product
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [
        {
          product: productId,
          color,
          price: product.price,
        },
      ],
    });
  } else {
    // product exist in cart, update product quantity
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() == productId && item.color == color
    );
    if (productIndex > -1) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;

      cart.cartItems[productIndex] = cartItem;
    } else {
      // product not exist in cart, push product to cartitems array
      cart.cartItems.push({ product: productId, color, price: product.price });
    }
  }
  //calculate total cost price
  calcTotalCartPrice(cart);

  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Product added to cart successfully",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

/**
 * @description get logged user cart
 * @route  Get /api/v1/carts
 * @access Private/user
 */

exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return next(
      new ApiError(`There is no cart for this user id${req.user._id}`, 404)
    );
  }

  res.status(200).json({
    status: "succsess",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

/**
 * @description Remove Cart Item
 * @route  Delete /api/v1/carts/:itemId
 * @access Private/user
 */

exports.removeSpecificCartItem = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItems: { _id: req.params.itemId } },
    },
    { new: true }
  );
  calcTotalCartPrice(cart);
  cart.save();

  res.status(200).json({
    status: "succsess",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

/**
 * @description clear logged user cart
 * @route  Delete /api/v1/carts/:itemId
 * @access Private/user
 */

exports.clearCart = asyncHandler(async (req, res, next) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.status(204).send();
});

/**
 * @description update specific cart item quantity
 * @route  Put /api/v1/carts/:itemId
 * @access Private/user
 */
exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(
      new ApiError(`There is no cart for this user id${req.user._id}`, 404)
    );
  }
  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() == req.params.itemId
  );
  if (itemIndex > -1) {
    const cartItem = cart.cartItems[itemIndex];
    cartItem.quantity = quantity;

    cart.cartItems[itemIndex] = cartItem;
  } else {
    return next(
      new ApiError(`There is no item for this id ${req.params.itemId}`, 404)
    );
  }
  calcTotalCartPrice(cart);
  await cart.save();

  res.status(200).json({
    status: "succsess",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

/**
 * @description upply coupon on logged user card
 * @route  Put /api/v1/carts/applycoupon
 * @access Private/user
 */
exports.applyCoupon = asyncHandler(async (req, res, next) => {
  //1-get coupon based on coupon name
  const coupon = await Coupon.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });

  if (!coupon) {
    return next(new ApiError(`Coupon is vaild or Expired`, 404));
  }

  //2-get logged user cardto get total card price
  const cart = await Cart.findOne({ user: req.user._id });

  const totalPrice = cart.totalCartprice;

  //3- calculate price after discaount
  const totalPriceAfterDiscount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2);

  cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
  await cart.save();

  res.status(200).json({
    status: "succsess",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});
