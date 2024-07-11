const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");

/**
 * @description Add address to user address list
 * @route  POST /api/v1/addresses
 * @access protect/User
 */

exports.addAddress = asyncHandler(async (req, res, next) => {
  //$addToSet => Add address Object to user address array if address not exist
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true }
  );

  res.status(200).json({
    status: "Success",
    message: "Address added Seccessfully .",
    data: user.addresses,
  });
});

/**
 * @description Delete address from user address list
 * @route  Delete /api/v1/addresses/:addressId
 * @access protect/User
 */

exports.deleteAddress = asyncHandler(async (req, res, next) => {
  //$pull => Remove Address object From user addresses array if address  exist
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { addresses: { _id: req.params.addressId } },
    },
    { new: true }
  );

  res.status(200).json({
    status: "Success",
    message: "Address Removed Seccessfully.",
    data: user.addresses,
  });
});

/**
 * @description Get Logged User Address List
 * @route  Delete /api/v1/addresses
 * @access protect/User
 */

exports.getLoggedUserAdressList = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("addresses");
  res.status(200).json({
    status: "Succsess",
    results: user.addresses.length,
    data: user.addresses,
  });
});
