import { z } from "zod";


// User Schema 
// Base User Schema (For Signup)
export const signupSchema = z.object({
  name: z.string().min(3, { message: "Must be 3 or more characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(4, { message: "Must be 4 or more characters long" }),
});

// Login Schema (Derived from signupSchema using `.pick()`)
export const loginSchema = signupSchema.pick({ email: true, password: true });

// User Response Schema (For API Response)
export const userResponseSchema = signupSchema.omit({ password: true }).extend({
  _id: z.string(),
  isAdmin: z.boolean(),
  createdAt: z.string().datetime({ message: "Invalid timestamp" }), // ISO timestamp
  updatedAt: z.string().datetime({ message: "Invalid timestamp" }),
});

// TypeScript Types
export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UserData = z.infer<typeof userResponseSchema>; // For API response
// ------------------------------------------------------------------------------------  


// Pizza Schema 
const sizeSchema = z.object({
  size: z.enum(["Small", "Medium", "Large"]),
  price: z.number().min(1, { message: "Price must be greater than 0" }),
});

const toppingSchema = z.object({
  name: z.string().min(1, { message: "Topping name is required" }),
  price: z.number().min(1, { message: "Price must be greater than 0" }),
});

export const pizzaSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional(), // Optional description
  image: z.string().url({ message: "Invalid image URL" }), // Ensures valid URL
  category: z.enum(["Veg", "Non-Veg"]),
  sizes: z.array(sizeSchema).min(1, { message: "At least one size must be provided" }),
  extraToppings: z.array(toppingSchema).optional(), // Optional toppings
});


// Extending PizzaInput with _id & timestamps
export const pizzaDataSchema = pizzaSchema.extend({
    _id: z.string(), // MongoDB ObjectId is a string
    createdAt: z.string().datetime({ message: "Invalid timestamp" }), // ISO timestamp
    updatedAt: z.string().datetime({ message: "Invalid timestamp" }),
  });


// TypeScript Types
export type PizzaInput = z.infer<typeof pizzaSchema>; // Input validation schema
export type PizzaData = z.infer<typeof pizzaDataSchema>; // Retrieved data schema
// -------------------------------------------------------------------------------------- 


// Order Schema 
// Extra Topping Schema
const extraToppingSchema = z.object({
  name: z.string().min(1, { message: "Topping name is required" }),
  price: z.number().min(0, { message: "Topping price must be a positive number" }),
});

// Product Schema
const productSchema = z.object({
  pizzaDetails: z.string().min(1, { message: "Pizza ID is required" }), // ObjectId (as string)
  size: z.enum(["Small", "Medium", "Large"]),
  extraToppings: z.array(extraToppingSchema).optional(),
  quantity: z.number().min(1, { message: "Quantity must be at least 1" }),
  price: z.number().min(0, { message: "Price must be a positive number" }),
});

// Order Input Schema (for request validation)
export const orderInputSchema = z.object({
  userId: z.string().min(1, { message: "User ID is required" }), // ObjectId (as string)
  address: z.string().min(5, { message: "Address is required and must be at least 5 characters" }),
  products: z.array(productSchema).min(1, { message: "At least one product is required" }),
  totalAmount: z.number().min(1, { message: "Total amount must be at least 1" }),
  paymentMethod: z.enum(["COD", "Online"]),
});

// TypeScript Type Inference
export type OrderInput = z.infer<typeof orderInputSchema>;




// // Define schema for extra toppings
// const extraToppingSchema = z.object({
//   name: z.string(),
//   price: z.number(),
// });

// Define schema for pizza details (populated field)
const pizzaDetailsSchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string(),
  image: z.string(),
});

// Define schema for each product in the order
const orderProductSchema = z.object({
  pizzaDetails: pizzaDetailsSchema, // Populated pizza details
  size: z.enum(["Small", "Medium", "Large"]),
  extraToppings: z.array(extraToppingSchema),
  quantity: z.number(),
  price: z.number(),
});

// Define schema for an order
const orderSchema = z.object({
  _id: z.string(),
  userId: z.string(),
  address: z.string(),
  totalAmount: z.number(),
  paymentMethod: z.enum(["COD", "Online"]),
  paymentStatus: z.enum(["Pending", "Paid", "Failed"]),
  razorpayOrderId: z.string().nullable(),
  razorpayPaymentId: z.string().nullable(),
  orderStatus: z.enum(["Placed", "Processing", "Out for Delivery", "Delivered", "Cancelled"]),
  products: z.array(orderProductSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Define the API response schema
export const getUserOrdersResponseSchema = z.array(orderSchema);

// Infer TypeScript Type (Optional)
export type GetUserOrdersResponse = z.infer<typeof getUserOrdersResponseSchema>;


// Schema for pagination info
const paginationSchema = z.object({
  currentPage: z.number().min(1),
  totalPages: z.number().min(1),
});

// Schema for order stats
const statsSchema = z.object({
  totalOrders: z.number().min(0),
  completedOrders: z.number().min(0),
  pendingOrders: z.number().min(0),
  cancelledOrders: z.number().min(0),
  totalEarnings: z.number().min(0),
});

// **Final schema for getAllOrders API response**
export const getAllOrdersResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  orders: z.array(orderSchema), // Reusing the existing order schema
  pagination: paginationSchema,
  stats: statsSchema,
});

// **Infer TypeScript types (optional)**
export type GetAllOrdersResponse = z.infer<typeof getAllOrdersResponseSchema>;
export type Pagination = z.infer<typeof paginationSchema>;
export type Stats = z.infer<typeof statsSchema>;
