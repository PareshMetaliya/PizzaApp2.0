import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

// Define types
interface ExtraTopping {
  name: string;
  price: number;
}

interface CartItem {
  pizzaDetails: {
    id: string;
    name: string;
    image: string;
  };
  size: "Small" | "Medium" | "Large";
  extraToppings?: ExtraTopping[];
  quantity: number;
  price: number;
}

// Define the initial state
interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

// Function to calculate total amount
const calculateTotalAmount = (items: CartItem[]) => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

// Function to compare extra toppings accurately
const areExtraToppingsEqual = (toppings1?: ExtraTopping[], toppings2?: ExtraTopping[]) => {
  if (!toppings1 && !toppings2) return true; // Both are undefined/null
  if (!toppings1 || !toppings2) return false; // One is missing
  if (toppings1.length !== toppings2.length) return false;

  // Sort toppings by name to ensure consistent order
  const sortedToppings1 = [...toppings1].sort((a, b) => a.name.localeCompare(b.name));
  const sortedToppings2 = [...toppings2].sort((a, b) => a.name.localeCompare(b.name));

  return sortedToppings1.every((t1, index) => 
    t1.name === sortedToppings2[index].name && t1.price === sortedToppings2[index].price
  );
};


// Create the slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Add item to cart
    addToCart(state, action: PayloadAction<CartItem>) {

      

      const existingItem = state.items.find(
        (item) =>
          item.pizzaDetails.id === action.payload.pizzaDetails.id &&
          item.size === action.payload.size &&
          areExtraToppingsEqual(item.extraToppings, action.payload.extraToppings)
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },

    // Increase quantity
    increaseQuantity(state, action: PayloadAction<{ pizzaId: string; size: string; extraToppings?: ExtraTopping[] }>) {
      const item = state.items.find(
        (item) =>
          item.pizzaDetails.id === action.payload.pizzaId &&
          item.size === action.payload.size &&
          areExtraToppingsEqual(item.extraToppings, action.payload.extraToppings)
      );

      if (item) {
        item.quantity += 1;
      }
    },

    // Decrease quantity
    decreaseQuantity(state, action: PayloadAction<{ pizzaId: string; size: string; extraToppings?: ExtraTopping[] }>) {
      const item = state.items.find(
        (item) =>
          item.pizzaDetails.id === action.payload.pizzaId &&
          item.size === action.payload.size &&
          areExtraToppingsEqual(item.extraToppings, action.payload.extraToppings)
      );

      if (item && item.quantity > 1) {
        item.quantity -= 1;
      } else {
        state.items = state.items.filter(
          (i) =>
            i.pizzaDetails.id !== action.payload.pizzaId ||
            i.size !== action.payload.size ||
            !areExtraToppingsEqual(i.extraToppings, action.payload.extraToppings)
        );
      }
    },

    // Remove item from cart
    removeFromCart(state, action: PayloadAction<{ pizzaId: string; size: string; extraToppings?: ExtraTopping[] }>) {
      state.items = state.items.filter(
        (i) =>
          i.pizzaDetails.id !== action.payload.pizzaId ||
          i.size !== action.payload.size ||
          !areExtraToppingsEqual(i.extraToppings, action.payload.extraToppings)
      );
    },

    // Empty cart
    emptyCart(state) {
      state.items = [];
    },
  },
});

// Export actions
export const { addToCart, increaseQuantity, decreaseQuantity, removeFromCart, emptyCart } = cartSlice.actions;

// Selectors
export const selectCart = (state: RootState) => state.cart;
export const selectTotalAmount = (state: RootState) => calculateTotalAmount(state.cart.items);

// Export reducer
export default cartSlice.reducer;
