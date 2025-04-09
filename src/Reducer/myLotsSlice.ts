// myLotsSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Product } from "../type/Product";
import { userService } from "../Service/userService";

type MyLotsState = {
  items: Product[];
  loading: boolean;
  error: string | null;
};

const initialState: MyLotsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchMyLots = createAsyncThunk(
  'myLots/fetchMyLots',
  async (_, { rejectWithValue }) => {
    try {
      return await userService.getMyAuctions();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const myLotsSlice = createSlice({
  name: "myLots",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyLots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyLots.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchMyLots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default myLotsSlice.reducer;