const express = require("express");

const {
  createCashOrder,
  findAllOrders,
  findSpecificOrder,
  filterOrderForLoggedUser,
  updateOrderToDeliverd,
  updateOrderToPaid,
  checkoutSession,
} = require("../services/orderService");
const authService = require("../services/authService");

const router = express.Router();

router.use(authService.protect);

router.get(
  "/checkout_session/:cartId",
  authService.alloewTo("user"),
  checkoutSession
);

router.route("/:cartId", authService.alloewTo("user")).post(createCashOrder);
router
  .route("/", authService.alloewTo("user", "admin", "manger"))
  .get(filterOrderForLoggedUser, findAllOrders);
router.route("/:id").get(findSpecificOrder);

router.put(
  "/:id/pay",
  authService.alloewTo("admin", "manger"),
  updateOrderToPaid
);
router.put(
  "/:id/deliver",
  authService.alloewTo("admin", "manger"),
  updateOrderToDeliverd
);

module.exports = router;
