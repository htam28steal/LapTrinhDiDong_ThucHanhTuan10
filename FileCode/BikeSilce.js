import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk để lấy dữ liệu từ API
export const fetchBikes = createAsyncThunk('bikes/fetchBikes', async () => {
  const response = await axios.get('https://670b3e51ac6860a6c2cb8625.mockapi.io/BikeStore');
  return response.data;
});
export const addProduct = createAsyncThunk(
  'bikes/addProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'https://670b3e51ac6860a6c2cb8625.mockapi.io/BikeStore',
        productData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const bikeSlice = createSlice({
  name: 'bikes',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBikes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBikes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchBikes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.push(action.payload); // Update the state with the new product
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default bikeSlice.reducer;
