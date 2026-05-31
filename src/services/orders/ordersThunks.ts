import { AppDispatch } from '../store';
import { getOrderByNumberApi, getOrdersApi } from '@api';
import {
  fetchOrdersStart,
  fetchOrdersSuccess,
  fetchOrdersError,
  setCurrentOrder
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

export const getOrderByNumber =
  (number: number) => async (dispatch: AppDispatch) => {
    try {
      const numOrder = await getOrderByNumberApi(number);
      dispatch(setCurrentOrder(numOrder));
    } catch (err: any) {
      dispatch(fetchOrdersError(err.message));
    }
  };
