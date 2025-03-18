// src/store/thunks/authThunk.ts

import { createAsyncThunk } from "@reduxjs/toolkit";
import { getUserApi } from "../../api/authAPI";
import { userResponseSchema } from "@/schema/userSchema";

// Thunk to fetch user details using JWT token
export const getUserThunk = createAsyncThunk(
  "auth/getUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
    
      if (response.success === false) {
        return rejectWithValue(response.message); // In case of failure
      }

      const validatedUser = userResponseSchema.safeParse(response.user);

      if (!validatedUser.success) {
        return rejectWithValue("Invalid user data format"); // In case of failure
      } // Return user data if success
      return validatedUser.data;
    } catch (error) {
      
      return rejectWithValue("Failed to fetch user");
    }
  }
);
