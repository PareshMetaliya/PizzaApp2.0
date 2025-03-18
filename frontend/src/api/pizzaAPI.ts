import axiosInstance from "../lib/axios";
import {
  CreatePizzaInput,
  GetPizzasQueryParams,
} from "../schema/pizzaSchema";

//  Create a new pizza (Admin only)
export const createPizzaApi = async (pizza: CreatePizzaInput) => {
  try {
    const response = await axiosInstance.post("/api/pizzas", pizza, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) {
    return { success: false, message: "Something went wrong" };
  }
};

//  Get all pizzas with pagination, sorting, and filtering
export const getAllPizzasApi = async (queryParams: GetPizzasQueryParams) => {
  try {
    const response = await axiosInstance.get("/api/pizzas", { params: queryParams });
 
    return response.data;
  } catch (error) {
    return { success: false, message: "Something went wrong" };
  }
};

//  Get a single pizza by ID
export const getPizzaByIdApi = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/api/pizzas/${id}`);
    return response.data;
  } catch (error) {
    return { success: false, message: "Something went wrong" };
  }
};

//  Update a pizza (Admin only)
export const updatePizzaApi = async ({ id, pizza }: { id: string; pizza: CreatePizzaInput }) => {
  try {
    const response = await axiosInstance.put(`/api/pizzas/${id}`, pizza, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) {
   
    return { success: false, message: "Something went wrong" };
  }
};

//  Delete a pizza (Admin only)
export const deletePizzaApi = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/api/pizzas/${id}`, {
      headers: { 
        Authorization: `Bearer ${localStorage.getItem("token")}` 
      },
    });
    return response.data;
  } catch (error) {
    return { success: false, message: "Something went wrong" };
  }
};
