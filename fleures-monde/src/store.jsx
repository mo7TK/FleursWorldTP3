import { configureStore } from "@reduxjs/toolkit";
import bouquetsReducer from "./services/bouquetSlice";
import authReducer from "./services/authSlice";
import cartReducer from "./services/cartSlice";

export const store = configureStore({
  reducer: {
    bouquets: bouquetsReducer,
    auth: authReducer,
    cart: cartReducer
  }
});