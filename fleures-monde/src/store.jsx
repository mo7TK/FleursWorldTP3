import { configureStore } from "@reduxjs/toolkit";
import bouquetsReducer from "./services/bouquetSlice";

export const store = configureStore({
  reducer: {
    bouquets: bouquetsReducer
  }
});
