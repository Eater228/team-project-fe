import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../Reducer/UsersSlice";

// Конфігурація стора
const store = configureStore({
  reducer: {
    userData: userReducer,
  },
});

// Типізація RootState та AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
