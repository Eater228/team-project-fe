import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, createTransform } from "redux-persist"; // Додано імпорт createTransform
import storage from 'redux-persist/lib/storage';
import userReducer from "../Reducer/UsersSlice";
import productsReducer, { ProductsState } from "../Reducer/ProductsSlice"; // Імпорт типу ProductsState
import favoriteReducer from "../Reducer/favoriteSlice";
import cartsReducer from "../Reducer/cartsSlice";
import categoriesReducer from "../Reducer/categoriesSlice";
import myLotsReducer from "../Reducer/myLotsSlice";

// Створюємо трансформацію для images
const productsTransform = createTransform(
  // На відправці в сховище - ніяких змін
  (inboundState: ProductsState) => inboundState,
  // При отриманні зі сховища - конвертуємо image → url
  (outboundState: ProductsState) => ({
    ...outboundState,
    items: outboundState.items.map(item => ({
      ...item,
      images: item.images?.map(img => ({
        image: (img as any).image || null, // Додаємо поле image
        url: img.url || (img as any).image // Обробляємо обидва варіанти
      })) || [] // На випадок відсутності images
    }))
  }),
  { whitelist: ['products'] }
);

const persistConfig = {
  key: 'root',
  storage,
  transforms: [productsTransform], // Використовуємо створену трансформацію
  whitelist: ['items'] // Вказуємо які поля зберігати
};

const persistedReducer = persistReducer(persistConfig, productsReducer);

// Конфігурація стора
const store = configureStore({
  reducer: {
    userData: userReducer,
    products: persistedReducer,
    favorite: favoriteReducer,
    carts: cartsReducer,
    categories: categoriesReducer,
    myLots: myLotsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
        ignoredPaths: ['products.items.*.images']
      }
    }),
});

// Типізація RootState та AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
export default store;