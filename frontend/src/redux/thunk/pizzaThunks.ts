// src/store/thunks/pizzaThunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllPizzasApi } from "../../api/pizzaAPI"; // Your API call file
import { getPizzasQuerySchema } from "@/schema/pizzaSchema"; // Your Zod schema for query params
import { GetPizzasQueryParams } from "../../schema/pizzaSchema"; // Type for query params

// Thunk to get all pizzas with query parameters for pagination, sorting, and filtering
export const getAllPizzaThunk = createAsyncThunk(
  "pizza/getAllPizzas",
  async (queryParams: GetPizzasQueryParams, { rejectWithValue }) => {
    try {

      // Validate and transform queryParams with Zod
      const validatedQueryParams = getPizzasQuerySchema.safeParse(queryParams);

      if (!validatedQueryParams.success) {
        return rejectWithValue("Invalid query parameters");
      }

      // Make the API call with validated query parameters
      const response = await getAllPizzasApi(validatedQueryParams.data);

      // If the API returns success, return the pizzas and pagination info
      if (response.success) {

        const { pizzas, totalPizzas, totalPages, currentPage } = response;
    
        return { pizzas, totalPizzas, totalPages, currentPage };
      } else {
        return rejectWithValue(response.message || "Failed to fetch pizzas");
      }
    } catch (error) {
      return rejectWithValue("Failed to fetch pizzas");
    }
  }
);
