// src/store/slices/pizzaSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAllPizzaThunk } from "../thunk/pizzaThunks"; // Import thunk for getting all pizzas
import { PizzaResponse } from "../../schema/pizzaSchema";
import { RootState } from "../store";

// Define the initial state shape, including pagination information
interface PizzaState {
  pizzas: PizzaResponse[];
  loading: boolean;
  error: string | null;
  totalPizzas: number;
  totalPages: number;
  currentPage: number;
}

// Initial state for pizza slice
const initialState: PizzaState = {
  pizzas: [],
  loading: false,
  error: null,
  totalPizzas: 0,
  totalPages: 0,
  currentPage: 1,
};

// Create the slice
const pizzaSlice = createSlice({
  name: "pizza",
  initialState,
  reducers: {
    // You can keep other normal reducers if needed (e.g., for setting error state)
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle the pending state when the thunk starts
      .addCase(getAllPizzaThunk.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear any previous errors
      })
      // Handle the fulfilled state when the thunk succeeds
      .addCase(getAllPizzaThunk.fulfilled, (state, action) => {
        state.loading = false;
        const { pizzas, totalPizzas, totalPages, currentPage } = action.payload;

        state.pizzas = pizzas;
        state.totalPizzas = totalPizzas;
        state.totalPages = totalPages;
        state.currentPage = currentPage;
      })
      // Handle the rejected state when the thunk fails
      .addCase(getAllPizzaThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Failed to fetch pizzas";
      });
  },
});

// Export actions (if any)
export const { setError } = pizzaSlice.actions;

export const selectpizzas = (state: RootState) => state.pizza;


// Export the reducer
export default pizzaSlice.reducer;
