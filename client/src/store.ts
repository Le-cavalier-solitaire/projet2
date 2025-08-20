import { configureStore } from "@reduxjs/toolkit";
import { ApiSlice } from "./slice/ApiSlice";
import authReducer from "../src/slice/Auth/authSlice";
import { authApi } from "./slice/Auth/authApi";
import UiReducer from "./slice/UI/UiSlice";

// Fonction pour charger l'état initial depuis localStorage
const loadAuthStateFromStorage = () => {
  try {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");
    const user = localStorage.getItem("user");

    return {
      token,
      refreshToken,
      user: user ? JSON.parse(user) : null,
      isAuthenticated: !!token, // Convertit en booléen
    };
  } catch (e) {
    console.error("Erreur lors du chargement de l'état d'authentification", e);
    return {
      token: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
    };
  }
};

export const store = configureStore({
  reducer: {
    [ApiSlice.reducerPath]: ApiSlice.reducer,
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
    ui: UiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(ApiSlice.middleware)
      .concat(authApi.middleware),
  preloadedState: {
    auth: loadAuthStateFromStorage(), // Charge l'état initial
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
