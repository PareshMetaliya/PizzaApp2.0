// src/store/slices/authSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getUserThunk } from "../thunk/authThunks";
import { UserData } from "../../schema/userSchema"; // Import the UserData type from your schema
import type { RootState } from "../store";

// Define a type for the slice state
interface AuthState {
  user: UserData | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Define the initial state using that type
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.loading = false;
      // Clear the localStorage token
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle getUserThunk states
      .addCase(getUserThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserThunk.fulfilled, (state, action:PayloadAction<UserData>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload; // Save user data
        state.error = null;
      })
      .addCase(getUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string; // Handle errors
      });
  },
});

// Export the actions
export const { logout } = authSlice.actions;

// Export individual selectors for specific state properties
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectLoading = (state: RootState) => state.auth.loading;
export const selectError = (state: RootState) => state.auth.error;

// Export the reducer
export default authSlice.reducer;
