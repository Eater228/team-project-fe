import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from 'redux-persist/lib/storage';
import userReducer from "../Reducer/UsersSlice";
import productsReducer from "../Reducer/ProductsSlice";
import favoriteReducer from "../Reducer/favoriteSlice";
import cartsReducer from "../Reducer/cartsSlice";
import categoriesReducer from "../Reducer/categoriesSlice";

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, productsReducer);

// Конфігурація стора
const store = configureStore({
  reducer: {
    userData: userReducer,
    products: persistedReducer,
    favorite: favoriteReducer,
    carts: cartsReducer,
    categories: categoriesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
        ignoredPaths: ['register'],
      },
    }),
});

// Типізація RootState та AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; // Додаємо тип для dispatch

export const persistor = persistStore(store)
export default store;


