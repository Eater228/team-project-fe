import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Product } from "../type/Product";
import { userService } from "../Service/userService";

type FavoriteState = {
  items: Product[];
  loading: boolean;
  error: string | null;
};

const initialState: FavoriteState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchFavorites = createAsyncThunk(
  'favorite/fetchFavorites',
  async (_, { rejectWithValue }) => {
    try {
      return await userService.getFavorites();
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const toggleFavorite = createAsyncThunk(
  'favorite/toggleFavorite', // Виправлено тип дії для точності
  async (productId: number, { rejectWithValue, dispatch }) => {
    try {
      await userService.toggleFavorite(productId);
      // Оновлюємо весь список після зміни
      await dispatch(fetchFavorites());
      return productId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const favoriteSlice = createSlice({
  name: "favorite",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Обробка отримання списку улюблених
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Обробка перемикання улюбленого
      .addCase(toggleFavorite.pending, (state) => {
        state.error = null; // Очищаємо помилки при початку запиту
      })
      .addCase(toggleFavorite.rejected, (state, action) => {
        state.error = action.payload as string; // Фіксуємо помилку
      });
  },
});

export default favoriteSlice.reducer;