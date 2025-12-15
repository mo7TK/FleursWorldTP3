import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // { bouquet, quantite }
  total: 0
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const bouquet = action.payload;
      const existingItem = state.items.find(item => item.bouquet.id === bouquet.id);
      
      if (existingItem) {
        existingItem.quantite += 1;
      } else {
        state.items.push({ bouquet, quantite: 1 });
      }
      
      // Calculer le total
      state.total = state.items.reduce((sum, item) => {
        return sum + (item.bouquet.prix || 0) * item.quantite;
      }, 0);
    },
    removeFromCart: (state, action) => {
      const bouquetId = action.payload;
      state.items = state.items.filter(item => item.bouquet.id !== bouquetId);
      
      // Recalculer le total
      state.total = state.items.reduce((sum, item) => {
        return sum + (item.bouquet.prix || 0) * item.quantite;
      }, 0);
    },
    updateQuantity: (state, action) => {
      const { bouquetId, quantite } = action.payload;
      const item = state.items.find(item => item.bouquet.id === bouquetId);
      
      if (item) {
        item.quantite = quantite;
        if (item.quantite <= 0) {
          state.items = state.items.filter(i => i.bouquet.id !== bouquetId);
        }
      }
      
      // Recalculer le total
      state.total = state.items.reduce((sum, item) => {
        return sum + (item.bouquet.prix || 0) * item.quantite;
      }, 0);
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    }
  }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;