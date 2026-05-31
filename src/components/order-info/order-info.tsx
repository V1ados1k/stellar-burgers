import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';

import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';

import { TIngredient } from '@utils-types';

import { selectIngredients } from '../../services/ingredients/ingredientsSlice';
import { selectOrders as selectFeedOrders } from '../../services/Feed/feedSlice';
import {
  selectUserOrders,
  selectCurrentOrder
} from '../../services/orders/ordersSlice';

import { getOrderByNumber } from '../../services/orders/ordersThunks';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();

  const dispatch = useDispatch();

  const ingredients = useSelector(selectIngredients);
  const feedOrders = useSelector(selectFeedOrders);
  const userOrders = useSelector(selectUserOrders);
  const currentOrder = useSelector(selectCurrentOrder);

  const allOrders = [...feedOrders, ...userOrders];

  const orderData = useMemo(
    () =>
      allOrders.find((order) => order.number === Number(number)) ||
      currentOrder,
    [allOrders, number, currentOrder]
  );

  useEffect(() => {
    if (!orderData && number) {
      dispatch(getOrderByNumber(Number(number)));
    }
  }, [orderData, number, dispatch]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce((acc, item) => {
      if (!acc[item]) {
        const ingredient = ingredients.find((ing) => ing._id === item);
        if (ingredient) {
          acc[item] = {
            ...ingredient,
            count: 1
          };
        }
      } else {
        acc[item].count++;
      }

      return acc;
    }, {} as TIngredientsWithCount);

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
