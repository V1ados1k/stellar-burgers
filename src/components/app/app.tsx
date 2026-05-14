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
  Navigate,
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

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(fetchFeed());
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

            <Route
              path='login'
              element={
                isAuthenticated ? <Navigate to='/profile' replace /> : <Login />
              }
            />
            <Route
              path='register'
              element={
                isAuthenticated ? (
                  <Navigate to='/profile' replace />
                ) : (
                  <Register />
                )
              }
            />
            <Route
              path='forgot-password'
              element={
                isAuthenticated ? (
                  <Navigate to='/profile' replace />
                ) : (
                  <ForgotPassword />
                )
              }
            />
            <Route
              path='reset-password'
              element={
                isAuthenticated ? (
                  <Navigate to='/profile' replace />
                ) : (
                  <ResetPassword />
                )
              }
            />
            <Route
              path='profile'
              element={
                isAuthenticated ? (
                  <Profile />
                ) : (
                  <Navigate to='/login' state={{ from: location }} replace />
                )
              }
            />
            <Route
              path='profile/orders'
              element={
                isAuthenticated ? (
                  <ProfileOrders />
                ) : (
                  <Navigate to='/login' state={{ from: location }} replace />
                )
              }
            />
            <Route
              path='profile/orders/:number'
              element={
                isAuthenticated ? (
                  <OrderInfo />
                ) : (
                  <Navigate to='/login' state={{ from: location }} replace />
                )
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
                  isAuthenticated ? (
                    <Modal onClose={closeModal} title='Детали заказа'>
                      <OrderInfo />
                    </Modal>
                  ) : (
                    <Navigate to='/login' state={{ from: location }} replace />
                  )
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
