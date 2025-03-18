import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import pizzaReducer from './slices/pizzaSlice';
import cartReducer from './slices/cartSlice';
import ordersReducer from './slices/orderSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    pizza: pizzaReducer,
    cart: cartReducer,
    orders: ordersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
