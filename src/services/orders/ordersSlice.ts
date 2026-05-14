import { createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import type { RootState } from '../store';

interface OrdersState {
  orders: TOrder[];
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  loading: false,
  error: null
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    fetchOrdersStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchOrdersSuccess(state, action) {
      state.loading = false;
      state.orders = action.payload;
    },
    fetchOrdersError(state, action) {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const { fetchOrdersStart, fetchOrdersSuccess, fetchOrdersError } =
  ordersSlice.actions;

export const selectUserOrders = (state: RootState) => state.orders.orders;
export const selectUserOrdersLoading = (state: RootState) =>
  state.orders.loading;
export const selectUserOrdersError = (state: RootState) => state.orders.error;

export default ordersSlice.reducer;
