import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '../Service/userService';

// Описуємо інтерфейс для категорії
interface Category {
  id: number;
  name: string;
  image: string;
}

// Тип стану
interface CategoriesState {
  categories: Category[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Початковий стан
const initialState: CategoriesState = {
  categories: [], // Початково пустий масив
  status: 'idle',
  error: null,
};

// Асинхронний екшен для завантаження категорій
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getCategories();
      // console.log(response);
      return response; // Приводимо до правильного типу
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error fetching categories');
    }
  }
);

// Створення slice
const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // console.log(action.payload);
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Unknown error';
      });
  },
});

export default categoriesSlice.reducer;
