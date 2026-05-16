import {
  ConstructorPage,
  NotFound404,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders
} from '@pages';

import { IngredientDetails, OrderInfo, Modal } from '@components';

import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  Location
} from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector, RootState } from '../../services/store';

import { fetchIngredients } from '../../services/ingredients/ingredientsThunks';
import { fetchFeed } from '../../services/Feed/feedThunks';

import { AppHeader } from '@components';
import { Preloader } from '@ui';

import styles from './app.module.css';
import { fetchUser } from '../../services/auth/authThunks';
import { ProtectedRoute } from '../routes/ProtectedRoute';

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { background?: Location };
  const backgroundLocation = state?.background;

  const loading = useSelector(
    (state: RootState) => state.ingredients.loading || state.feed.loading
  );

  const error = useSelector(
    (state: RootState) => state.ingredients.error || state.feed.error
  );

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(fetchFeed());
    dispatch(fetchUser());
  }, [dispatch]);

  const closeModal = () => {
    navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />

      {loading ? (
        <Preloader />
      ) : error ? (
        <div className={`${styles.error} text text_type_main-medium pt-4`}>
          {String(error)}
        </div>
      ) : (
        <>
          <Routes location={backgroundLocation || location}>
            <Route path='/' element={<ConstructorPage />} />
            <Route path='feed' element={<Feed />} />
            <Route path='feed/:number' element={<OrderInfo />} />
            <Route path='ingredients/:id' element={<IngredientDetails />} />

            <Route path='login' element={<Login />} />
            <Route path='register' element={<Register />} />
            <Route path='forgot-password' element={<ForgotPassword />} />
            <Route path='reset-password' element={<ResetPassword />} />
            <Route
              path='profile'
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path='profile/orders'
              element={
                <ProtectedRoute>
                  <ProfileOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path='profile/orders/:number'
              element={
                <ProtectedRoute>
                  <OrderInfo />
                </ProtectedRoute>
              }
            />
            <Route path='*' element={<NotFound404 />} />
          </Routes>

          {backgroundLocation && (
            <Routes>
              <Route
                path='feed/:number'
                element={
                  <Modal onClose={closeModal} title='Детали заказа'>
                    <OrderInfo />
                  </Modal>
                }
              />
              <Route
                path='ingredients/:id'
                element={
                  <Modal onClose={closeModal} title='Детали ингредиента'>
                    <IngredientDetails />
                  </Modal>
                }
              />
              <Route
                path='profile/orders/:number'
                element={
                  <Modal onClose={closeModal} title='Детали заказа'>
                    <OrderInfo />
                  </Modal>
                }
              />
            </Routes>
          )}
        </>
      )}
    </div>
  );
};

export default App;
