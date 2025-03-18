import express from "express";
import { getUserOrders,getAllOrders,updateOrderStatus,createOrder,verifyPayment, getOrderById } from "../controllers/orderController.js";
import { adminOnly, loginRequired } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/create",loginRequired, createOrder); // Order creation (COD/Online)
router.post("/verify",loginRequired, verifyPayment); // Razorpay payment verification

// User-specific orders
router.get("/user", loginRequired, getUserOrders);

// Admin: Get all orders
router.get("/admin", loginRequired, adminOnly, getAllOrders);

// Admin: Update order status
router.put("/update/:id", loginRequired,adminOnly, updateOrderStatus);


router.get('/:orderId', loginRequired, getOrderById);

export default router;
