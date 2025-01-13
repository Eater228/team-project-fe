import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../Reducer/UsersSlice";
import productsReducer from "../Reducer/ProductsSlice";
import favoriteReducer from "../Reducer/favoriteSlice";
import cartsReducer from "../Reducer/cartsSlice";

// Конфігурація стора
const store = configureStore({
  reducer: {
    userData: userReducer,
    products: productsReducer,
    favorite: favoriteReducer,
    carts: cartsReducer,
  },
});

// Типізація RootState та AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; // Додаємо тип для dispatch

export default store;
