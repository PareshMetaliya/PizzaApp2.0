import axios, { AxiosError } from "axios";
import axiosInstance from "../lib/axios";
import { SignupInput, LoginInput } from "../schema/userSchema";

//  Register User
export const registerUserApi = async (userData: SignupInput) => {
  try {
    const response = await axiosInstance.post("/api/users/register", userData);
    return response.data;
  } catch (error: unknown) {
    return handleApiError(error);
  }
};

//  Login User
export const loginUserApi = async (credentials: LoginInput) => {
  try {
    const response = await axiosInstance.post("/api/users/login", credentials);
    return response.data;
  } catch (error: unknown) {
    return handleApiError(error);
  }
};

//  Get User
export const getUserApi = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.get("/api/users/getuser", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
   
  } catch (error: unknown) {
    return handleApiError(error);
  }
};

//  Global Error Handling Function
const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return {
      success: false,
      message: axiosError.response?.data?.message || "Something went wrong",
    };
  } else {
    return { success: false, message: "Network error or unexpected issue" };
  }
};
