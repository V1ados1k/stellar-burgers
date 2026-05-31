import { AppDispatch } from '../store';
import { orderBurgerApi } from '@api';
import {
  orderRequestStart,
  orderRequestSuccess,
  orderRequestError,
  clearConstructor
} from './burgerConstructorSlice';
import type { RootState } from '../store';
import { fetchFeed } from '../Feed/feedThunks';
import { fetchOrders } from '../orders/ordersThunks';

export const createOrder =
  () => async (dispatch: AppDispatch, getState: () => RootState) => {
    const { bun, ingredients } = getState().burgerConstructor;

    if (!bun) return;

    dispatch(orderRequestStart());

    const ingredientsIds = [
      bun._id,
      ...ingredients.map((item) => item._id),
      bun._id
    ];

    try {
      const data = await orderBurgerApi(ingredientsIds);
      dispatch(orderRequestSuccess(data.order));
      dispatch(fetchFeed());
      dispatch(fetchOrders());
      dispatch(clearConstructor());
    } catch (err: any) {
      dispatch(orderRequestError(err?.message || 'Ошибка заказа'));
    }
  };
