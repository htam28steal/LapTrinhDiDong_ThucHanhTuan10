import { configureStore } from '@reduxjs/toolkit';
import bikeReducer from './BikeSlice';

export const store = configureStore({
  reducer: {
    bikes: bikeReducer,
  },
});
