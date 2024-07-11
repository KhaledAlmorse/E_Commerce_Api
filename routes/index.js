const CategoryRoute = require("./categoryRoute");
const SubCategoryRoute = require("./subCategoryRoute");
const BrandRouter = require("./brandRouter");
const ProductRoute = require("./productRoute ");
const UserRoute = require("./userRouter");
const AuthRoute = require("./authRoute");
const ReviewRouter = require("./reviewRouter");
const WishlistRouter = require("./wishListRoute");
const AddressRouter = require("./addressRoute");
const CouponRouter = require("./couponRoute");
const CartRouter = require("./cartRoute");
const OrderRouter = require("./OrderRoute");

const mountRoutes = (app) => {
  app.use("/api/v1/categories", CategoryRoute);
  app.use("/api/v1/subcategories", SubCategoryRoute);
  app.use("/api/v1/brands", BrandRouter);
  app.use("/api/v1/products", ProductRoute);
  app.use("/api/v1/users", UserRoute);
  app.use("/api/v1/auth", AuthRoute);
  app.use("/api/v1/reviews", ReviewRouter);
  app.use("/api/v1/wishlist", WishlistRouter);
  app.use("/api/v1/addresses", AddressRouter);
  app.use("/api/v1/coupons", CouponRouter);
  app.use("/api/v1/carts", CartRouter);
  app.use("/api/v1/orders", OrderRouter);
};

module.exports = mountRoutes;
