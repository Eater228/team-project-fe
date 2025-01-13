import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../type/Product";

type FavoriteState = {
  items: Product[];
};

const initialState: FavoriteState = {
  items: JSON.parse(localStorage.getItem("favorite") || "[]"),
};

const favoriteSlice = createSlice({
  name: "favorite",
  initialState,
  reducers: {
    addToFavorite: (state, action: PayloadAction<Product>) => {
      state.items.push(action.payload);
      localStorage.setItem("favorite", JSON.stringify(state.items));
    },
    removeFromFavorite: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      localStorage.setItem("favorite", JSON.stringify(state.items));
    },
  },
});

export const { addToFavorite, removeFromFavorite } = favoriteSlice.actions;

export default favoriteSlice.reducer;
