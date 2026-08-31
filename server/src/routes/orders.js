import { Router } from "express";
import {
  quoteCart,
  createOrder,
  lookupOrders,
  createCashfreeOrder,
  verifyCashfreePayment,
  createRazorpayOrder,
  verifyRazorpayPayment,
  cancelAbandonedPayment,
  adminListOrders,
  adminUpdateOrderStatus
} from "../controllers/orderController.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

router.post("/quote", quoteCart);
router.post("/", createOrder);
router.post("/lookup", lookupOrders);
router.post("/cashfree/create", createCashfreeOrder);
router.post("/cashfree/verify", verifyCashfreePayment);
router.post("/razorpay/create", createRazorpayOrder);
router.post("/razorpay/verify", verifyRazorpayPayment);
router.post("/:id/cancel-abandoned-payment", cancelAbandonedPayment);

router.get("/admin", requireAdmin, adminListOrders);
router.patch("/admin/:id/status", requireAdmin, adminUpdateOrderStatus);

export default router;
