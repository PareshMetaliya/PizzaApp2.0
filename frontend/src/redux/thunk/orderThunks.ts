import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createOrderApi,
  getUserOrdersApi,
  verifyPaymentApi,
  getAllOrdersApi,
  updateOrderStatusApi,
} from "../../api/orderAPI"; // Import your API functions
import { CreateOrderInput } from "../../schema/orderSchema"; // Import your Zod schemas
import { emptyCart } from "../slices/cartSlice";
import toast from 'react-hot-toast';

// Create a new order
export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderData: CreateOrderInput, { rejectWithValue,dispatch  }) => {
    try {
      const response = await createOrderApi(orderData);
     
      if (response.success) {
        dispatch(emptyCart());
        toast.success("Order Placed Successfully...")
        return response.order; // Return the created order
      } else {
        return rejectWithValue(response.message || "Failed to create order");
      }
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create order");
    }
  }
);

// Verify Razorpay payment
export const verifyPayment = createAsyncThunk(
  "orders/verifyPayment",
  async (
    { userId, razorpay_order_id, razorpay_payment_id, razorpay_signature }: any,
    { rejectWithValue,dispatch }
  ) => {
    try {
      const response = await verifyPaymentApi({
        userId,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });
      if (response.success) {
        dispatch(emptyCart());
        return response.order; // Return the updated order
      } else {
        return rejectWithValue(response.message || "Payment verification failed");
      }
    } catch (error: any) {
      return rejectWithValue(error.message || "Payment verification failed");
    }
  }
);

// Fetch user-specific orders
export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserOrdersApi();
      if (response.success) {
        return response.orders; // Return the user's orders
      } else {
        return rejectWithValue(response.message || "Failed to fetch user orders");
      }
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch user orders");
    }
  }
);

// Fetch all orders (Admin only)
export const fetchAllOrders = createAsyncThunk(
  "orders/fetchAllOrders",
  async (
    { page, limit, orderStatus, paymentStatus, paymentMethod }: any,
    { rejectWithValue }
  ) => {
    try {
      const response = await getAllOrdersApi({
        page,
        limit,
        orderStatus,
        paymentStatus,
        paymentMethod,
      });
      if (response.success) {
     
        return response; // Return the paginated orders and stats
      } else {
        return rejectWithValue(response.message || "Failed to fetch all orders");
      }
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch all orders");
    }
  }
);

// Update order status (Admin only)
export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async (
    { orderId, status }: { orderId: string; status: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await updateOrderStatusApi(orderId, status);
      if (response.success) {
        toast.success("Status Updated...")
        return response.order; // Return the updated order
      } else {
        return rejectWithValue(response.message || "Failed to update order status");
      }
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update order status");
    }
  }
);