import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../type/Product";
import { userService } from "../Service/userService";

type ProductsState = {
  items: Product[];
  loading: boolean;
  error: string | null;
};

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
};


// export const fetchProducts = createAsyncThunk<Product[]>(
//   "products/fetchProducts",
//   async () => {
//     const response = await fetch("http://localhost:3001/products");
//     if (!response.ok) {
//       throw new Error("Failed to fetch products");
//     }
//     return await response.json();
//   }
// );

export const fetchProducts = createAsyncThunk<Product[], void>(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const products: any = await userService.getProducts(); // Гарантовано масив
      return products;
    } catch (error: any) {
      console.error("Error fetching products", error);
      return rejectWithValue(error.message || "Failed to fetch products");
    }
  }
);





const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
    },
    updateProductPrice: (state, action: PayloadAction<{ productId: number, newPrice: number }>) => {
      const { productId, newPrice } = action.payload;
      const product = state.items.find(product => product.id === productId);
      if (product) {
        product.currentPrice = newPrice;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
      });
  },
});

export const { setProducts, updateProductPrice } = productsSlice.actions;

export default productsSlice.reducer;
