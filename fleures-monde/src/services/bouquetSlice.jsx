import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bouquets: []
};

const bouquetsSlice = createSlice({
  name: "bouquets",
  initialState,
  reducers: {
    setBouquets: (state, action) => {
      state.bouquets = action.payload;
    },
    toggleLike: (state, action) => {
      const id = action.payload;
      state.bouquets = state.bouquets.map(b => {
        if (b.id === id) {
          const liked = !b.liked;
          const likes = liked ? (b.likes || 0) + 1 : (b.likes || 0) - 1;
          return { ...b, liked, likes };
        }
        return b;
      });
    },
    updateLikes: (state, action) => {
      // mettre à jour likes depuis backend (pulling)
      const updated = action.payload;
      state.bouquets = state.bouquets.map(b => {
        const u = updated.find(item => item.id === b.id);
        return u ? { ...b, likes: u.likes } : b;
      });
    }
  }
});

export const { setBouquets, toggleLike, updateLikes } = bouquetsSlice.actions;
export default bouquetsSlice.reducer;
