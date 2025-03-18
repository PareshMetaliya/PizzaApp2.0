import { createSlice } from "@reduxjs/toolkit";

import { OrderResponse } from "../../schema/orderSchema"; // Import your Zod schemas
import { RootState } from "../store";
import {
  createOrder,
  fetchAllOrders,
  fetchUserOrders,
  updateOrderStatus,
  verifyPayment,
} from "../thunk/orderThunks";

// Define the initial state
interface OrdersState {
  orders: OrderResponse[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
  };
  stats: {
    totalOrders: number;
    completedOrders: number;
    pendingOrders: number;
    cancelledOrders: number;
    totalEarnings: number;
  };
}

const initialState: OrdersState = {
  orders: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
  },
  stats: {
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    cancelledOrders: 0,
    totalEarnings: 0,
  },
};

// Create the slice
const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    resetOrdersState: () => initialState, // Reset state to initial
  },
  extraReducers: (builder) => {
    // Handle all thunks here
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
        
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create order";
      })
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.loading = false;
        const updatedOrder = action.payload;
        const index = state.orders.findIndex(
          (order) => order._id === updatedOrder._id
        );
        if (index !== -1) {
          state.orders[index] = updatedOrder;
        }else{
       
          state.orders.push(action.payload);
        }
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Payment verification failed";
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch user orders";
      })
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.pagination = action.payload.pagination;
        state.stats = action.payload.stats;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch all orders";
      })
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedOrder = action.payload;
        const index = state.orders.findIndex(
          (order) => order._id === updatedOrder._id
        );
        if (index !== -1) {
          state.orders[index] = updatedOrder;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update order status";
      });
  },
});

// Export actions
export const { resetOrdersState } = ordersSlice.actions;

// Export selectors
export const selectOrders = (state: RootState) => state.orders.orders;
export const selectLoading = (state: RootState) => state.orders.loading;
export const selectError = (state: RootState) => state.orders.error;
export const selectPagination = (state: RootState) => state.orders.pagination;
export const selectStats = (state: RootState) => state.orders.stats;

// Export the slice reducer
export default ordersSlice.reducer;
