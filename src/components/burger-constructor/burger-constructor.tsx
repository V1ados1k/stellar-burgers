import { FC, useMemo } from 'react';
import { useDispatch, useSelector, RootState } from '../../services/store';
import { BurgerConstructorUI } from '@ui';
import { closeOrderModal } from '../../services/burgerConstructor/burgerConstructorSlice';
import { createOrder } from '../../services/burgerConstructor/burgerConstructorThunks';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const bun = useSelector((state: RootState) => state.burgerConstructor.bun);
  const ingredients = useSelector(
    (state: RootState) => state.burgerConstructor.ingredients
  );
  const orderRequest = useSelector(
    (state: RootState) => state.burgerConstructor.orderRequest
  );
  const orderModalData = useSelector(
    (state: RootState) => state.burgerConstructor.orderModalData
  );

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const constructorItems = {
    bun,
    ingredients
  };

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!isAuthenticated) {
      return navigate('/login', { replace: true });
    } else {
      dispatch(createOrder());
    }
  };

  const handleCloseOrderModal = () => {
    dispatch(closeOrderModal());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce((s, v) => s + v.price, 0),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={handleCloseOrderModal}
    />
  );
};
