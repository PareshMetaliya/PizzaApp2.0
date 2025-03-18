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
  