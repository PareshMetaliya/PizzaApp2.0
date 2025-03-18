import Order from "../models/Order.js";
import { razorpay } from "../utils/razorpay.js";
import crypto from "crypto";



// Create a new order
// POST: /api/orders/create - login required
export const createOrder = async (req, res) => {
  try {
   
    const { userId, address, products, totalAmount, paymentMethod } = req.body;

    // Check if userId from the request matches the logged-in user
    if (req.user._id.toString() !== userId) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied. Invalid user" });
    }

    if (!userId || !address || !products.length || !totalAmount) {
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });
    }

    let paymentStatus = "Pending";
    let razorpayOrderId = null;

    // Create order in database first
    const order = await Order.create({
      userId,
      address,
      products,
      totalAmount,
      paymentMethod,
      paymentStatus,
      razorpayOrderId, // Initially null, updated later
    });

    // If Online Payment, generate Razorpay order
    if (paymentMethod === "Online") {
      const options = {
        amount: totalAmount * 100, // Convert to paise (INR)
        currency: "INR",
        receipt: `order_${order._id}`, // Store MongoDB order ID
      };

      const razorpayOrder = await razorpay.orders.create(options);
      razorpayOrderId = razorpayOrder.id;

      //  Update order with Razorpay Order ID
      order.razorpayOrderId = razorpayOrderId;
      await order.save();

      return res.json({
        success: true,
        message: "Razorpay order created",
        orderId: razorpayOrder.id,
        amount: options.amount,
        currency: options.currency,
        key: process.env.RAZORPAY_KEY_ID,
      });
    }

    // If COD, return success response
    res
      .status(201)
      .json({ success: true, message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

// Verify Razorpay payment
// POST: /api/orders/verify - login required
export const verifyPayment = async (req, res) => {
  try {
    const {
      userId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    // Check if userId from the request matches the logged-in user
    if (req.user._id.toString() !== userId) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied. Invalid user" });
    }

    const hmac = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (hmac !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment signature" });
    }

    const orderStatus = await Order.findOne({
      razorpayOrderId: razorpay_order_id,
    });
    if (!orderStatus) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Update order status in DB
    const order = await Order.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id }, // Find by stored Razorpay order ID
      {
        paymentStatus: "Paid",
        razorpayPaymentId: razorpay_payment_id,
      
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Payment verified successfully",
      order,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Payment verification failed", error });
  }
};

// Get user-specific orders
// GET: /api/orders/user - login required
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate("products.pizzaDetails", "name description image")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      message: "User orders fetched successfully",
      orders,
    });
  } catch (error) {
   
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all orders (Admin only) with pagination, sorting, and aggregation
// GET: /api/orders/admin - login required, admin only
export const getAllOrders = async (req, res) => {
  try {
    // Check admin access
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only",
      });
    }

    // Pagination setup
    const page = parseInt(req.query.page) || 1; // Default page 1
    const limit = parseInt(req.query.limit) || 10; // Default limit 10 orders per page
    const skip = (page - 1) * limit;

    // Filtering setup
    const filter = {};
    if (req.query.orderStatus) {
      filter.orderStatus = req.query.orderStatus;
    }
    if (req.query.paymentStatus) {
      filter.paymentStatus = req.query.paymentStatus;
    }
    if (req.query.paymentMethod) {
      filter.paymentMethod = req.query.paymentMethod;
    }

    // Get total count of filtered orders (before pagination)
    const totalFilteredOrders = await Order.countDocuments(filter);

    // Fetch paginated & filtered orders
    const orders = await Order.find(filter)
      .populate("userId", "name email")
      .populate("products.pizzaDetails", "name description image")
      .sort({ createdAt: -1 }) // Sort by newest orders first
      .skip(skip)
      .limit(limit);

    // Aggregation: Get total counts and revenue from filtered orders
    const stats = await Order.aggregate([
      { $match: filter }, // Apply filters here to aggregate only relevant orders
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          completedOrders: {
            $sum: { $cond: [{ $eq: ["$orderStatus", "Delivered"] }, 1, 0] },
          },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ["$orderStatus", "Placed"] }, 1, 0] },
          },
          cancelledOrders: {
            $sum: { $cond: [{ $eq: ["$orderStatus", "Cancelled"] }, 1, 0] },
          },
          totalEarnings: { $sum: "$totalAmount" }, // Assuming `totalAmount` exists in Order schema
        },
      },
    ]);

    const aggregatedData =
      stats.length > 0
        ? stats[0]
        : {
            totalOrders: 0,
            completedOrders: 0,
            pendingOrders: 0,
            cancelledOrders: 0,
            totalEarnings: 0,
          };

    res.json({
      success: true,
      message: "Orders fetched successfully",
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalFilteredOrders / limit), // Now using only filtered count
      },
      stats: aggregatedData,
    });
  } catch (error) {
 
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update order status (Admin only)
// PUT: /api/orders/update/:id - login required, admin only
export const updateOrderStatus = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied. Admins only" });
    }

    const { status } = req.body;
    if (!status) {
      return res
        .status(400)
        .json({ success: false, message: "Status is required" });
    }

    const validStatuses = [
      "Placed",
      "Processing",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    order.orderStatus = status; // ✅ Use correct field name
    await order.save();

    res.json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id; // Extract userId from the authenticated user (JWT)

   

  

    // Find the order by ID and populate related fields
    const order = await Order.findById(orderId)
      .populate("userId", "name email") // Populate user details
      .populate("products.pizzaDetails", "name description image"); // Populate pizza details



 // Check if the order belongs to the authenticated user
 if (order.userId._id.toString() !== userId.toString()) {
  return res.status(403).json({
    success: false,
    message: "Unauthorized: You do not have access to this order",
  });
}

    // Check if the order exists
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Return the order details
    res.status(200).json({ success: true, order });
  } catch (error) {

    res
      .status(500)
      .json({ success: false, message: "Failed to fetch order details" });
  }
};
