import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';

const initialState = {
  orders: [],
  totalToday: 0,
  total: 0,
  loading: false,
  error: null as string | null
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    fetchStart(state) {
      state.loading = true;
    },
    fetchSuccess(state, action) {
      state.loading = false;
      state.orders = action.payload.orders;
      state.totalToday = action.payload.totalToday;
      state.total = action.payload.total;
    },
    fetchError(state, action) {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const { fetchStart, fetchSuccess, fetchError } = feedSlice.actions;

export const selectOrders = (state: RootState) => state.feed.orders;
export const selectTotalToday = (state: RootState) => state.feed.totalToday;
export const selectTotal = (state: RootState) => state.feed.total;
export const selectLoading = (state: RootState) => state.feed.loading;
export const selectError = (state: RootState) => state.feed.error;

export default feedSlice.reducer;
