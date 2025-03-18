import { z } from "zod";

// Order Schema
// Extra Topping Schema
const extraToppingSchema = z.object({
  name: z.string().min(1, { message: "Topping name is required" }),
  price: z
    .number()
    .min(0, { message: "Topping price must be a positive number" }),
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
export const createOrderSchema = z.object({
  userId: z.string().min(1, { message: "User ID is required" }), // ObjectId (as string)
  address: z
    .string()
    .min(5, {
      message: "Address is required and must be at least 5 characters",
    }),
  products: z
    .array(productSchema)
    .min(1, { message: "At least one product is required" }),
  totalAmount: z
    .number()
    .min(1, { message: "Total amount must be at least 1" }),
  paymentMethod: z.enum(["COD", "Online"]),
});




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
export const orderResponseSchema = z.object({
  _id: z.string(),
  userId: z.string(),
  address: z.string(),
  totalAmount: z.number(),
  paymentMethod: z.enum(["COD", "Online"]),
  paymentStatus: z.enum(["Pending", "Paid", "Failed"]),
  razorpayOrderId: z.string().nullable(),
  razorpayPaymentId: z.string().nullable(),
  orderStatus: z.enum([
    "Placed",
    "Processing",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
  ]),
  products: z.array(orderProductSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Define the API response schema
export const getUserOrdersResponseSchema = z.array(orderResponseSchema);

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
  orders: z.array(orderResponseSchema), // Reusing the existing order schema
  pagination: paginationSchema,
  stats: statsSchema,
});


// Define the valid statuses for the order
const validStatuses = ["Placed", "Processing", "Out for Delivery", "Delivered", "Cancelled"] as const;

// Create a Zod schema for the request body
export const updateOrderStatusSchema = z.object({
  orderId:z.string(),
  status: z.enum(validStatuses),  // Ensures that status is one of the valid values
});


// TypeScript Type Inference
export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export type OrderResponse = z.infer<typeof orderResponseSchema>;
export type GetUserOrdersResponse = z.infer<typeof getUserOrdersResponseSchema>;

export type GetAllOrdersResponse = z.infer<typeof getAllOrdersResponseSchema>;
export type Pagination = z.infer<typeof paginationSchema>;
export type Stats = z.infer<typeof statsSchema>;
