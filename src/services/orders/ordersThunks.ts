import { AppDispatch } from '../store';
import { getOrdersApi } from '@api';
import {
  fetchOrdersStart,
  fetchOrdersSuccess,
  fetchOrdersError
} from './ordersSlice';

export const fetchOrders = () => async (dispatch: AppDispatch) => {
  dispatch(fetchOrdersStart());

  try {
    const data = await getOrdersApi();
    dispatch(fetchOrdersSuccess(data));
  } catch (err: any) {
    dispatch(fetchOrdersError(err?.message || 'Ошибка получения заказов'));
  }
};
