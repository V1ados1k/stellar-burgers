import { Preloader } from '@ui';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { RootState } from 'src/services/store';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const isAuthChecked = useSelector(
    (state: RootState) => state.auth.isAuthChecked
  );
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  if (isAuthChecked) {
    return <Preloader />;
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
