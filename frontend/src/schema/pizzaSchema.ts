import { z } from "zod";

// Size Schema
const sizeSchema = z.object({
  size: z.enum(["Small", "Medium", "Large"]),
  price: z.number().min(1, { message: "Price must be greater than 0" }),
});

// Extra Topping Schema
const extraToppingSchema = z.object({
  name: z.string().min(1, { message: "Topping name is required" }),
  price: z.number().min(1, { message: "Price must be greater than 0" }),
});

// Create/Update Pizza Schema (Request Body)
export const createPizzaSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional(),
  image: z.string().url({ message: "Invalid image URL" }),
  category: z.enum(["Veg", "Non-Veg"]),
  sizes: z.array(sizeSchema).min(1, { message: "At least one size must be provided" }),
  extraToppings: z.array(extraToppingSchema).optional(),
});

// Schema for a Single Pizza (API Response)
export const pizzaResponseSchema = createPizzaSchema.extend({
  _id: z.string(),
  createdAt: z.string().datetime({ message: "Invalid timestamp" }),
  updatedAt: z.string().datetime({ message: "Invalid timestamp" }),
});

// Get All Pizzas Query Parameters Schema (Filters, Pagination, Sorting)
export const getPizzasQuerySchema = z.object({
  page: z.number().optional().default(1),
  limit: z.number().optional().default(10),
  sortBy: z.enum(["priceAsc", "priceDesc"]).optional(),
  category: z.enum(["Veg", "Non-Veg"]).optional(),
  size: z.enum(["Small", "Medium", "Large"]).optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
});

// Pagination Response Schema
export const paginationSchema = z.object({
  totalPizzas: z.number().min(0),
  totalPages: z.number().min(1),
  currentPage: z.number().min(1),
});

// Get All Pizzas API Response Schema
export const getPizzasResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  totalPizzas: z.number().min(0),
  totalPages: z.number().min(1),
  currentPage: z.number().min(1),
  pizzas: z.array(pizzaResponseSchema),
});

// Type Definitions
export type CreatePizzaInput = z.infer<typeof createPizzaSchema>;
export type PizzaResponse = z.infer<typeof pizzaResponseSchema>;
export type GetPizzasQueryParams = z.infer<typeof getPizzasQuerySchema>;
export type GetPizzasResponse = z.infer<typeof getPizzasResponseSchema>;
