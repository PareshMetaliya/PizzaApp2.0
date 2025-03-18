import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "Online"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    razorpayOrderId: {
      type: String, // Store Razorpay order ID generated during order creation
      default: null,
    },
    razorpayPaymentId: {
      type: String, // Store Razorpay payment ID after successful payment
      default: null,
    },
    orderStatus: {
      type: String,
      enum: ["Placed", "Processing", "Out for Delivery", "Delivered", "Cancelled"],
      default: "Placed",
    },
    products: [
      {
        pizzaDetails: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Pizza",
          required: true,
        },
        size: {
          type: String,
          enum: ["Small", "Medium", "Large"],
          required: true,
        },
        extraToppings: [
          {
            name: { type: String, required: true },
            price: { type: Number, required: true },
          },
        ],
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }, // Price of the selected size
      },
    ],
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
