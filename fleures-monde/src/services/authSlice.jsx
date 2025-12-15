import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      // Sauvegarder le token dans localStorage
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      // Supprimer le token de localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    restoreAuth: (state) => {
      // Restaurer l'authentification depuis localStorage
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      
      if (token && user) {
        state.isAuthenticated = true;
        state.token = token;
        state.user = JSON.parse(user);
      }
    }
  }
});

export const { loginSuccess, logout, restoreAuth } = authSlice.actions;
export default authSlice.reducer;