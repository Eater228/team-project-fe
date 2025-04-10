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
  'favorite/toggleFavorite',
  async (productId: number, { rejectWithValue, dispatch }) => {
    try {
      await userService.toggleFavorite(productId);
      await dispatch(fetchFavorites()); // Оновлюємо весь список
      return productId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const favoriteSlice = createSlice({
  name: "favorite",
  initialState,
  reducers: {
    // Додано новий редюсер для очищення стану
    clearFavorites: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
  },
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
        state.error = null;
      })
      .addCase(toggleFavorite.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

// Експорт нового редюсера
export const { clearFavorites } = favoriteSlice.actions;
export default favoriteSlice.reducer;