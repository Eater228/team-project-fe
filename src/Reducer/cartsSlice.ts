import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../type/Product";

type CartItem = { count: number } & Product;

type CartsState = {
  items: CartItem[];
};

const initialState: CartsState = {
  items: JSON.parse(localStorage.getItem("carts") || "[]"),
};

const cartsSlice = createSlice({
  name: "carts",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      state.items.push(action.payload);
      localStorage.setItem("carts", JSON.stringify(state.items));
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      localStorage.setItem("carts", JSON.stringify(state.items));
    },
    updateCartItem: (state, action: PayloadAction<CartItem>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
      localStorage.setItem("carts", JSON.stringify(state.items));
    },
  },
});

export const { addToCart, removeFromCart, updateCartItem } = cartsSlice.actions;

export default cartsSlice.reducer;
