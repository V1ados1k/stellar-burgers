import { useEffect, FC } from 'react';
import { useDispatch, useSelector, RootState } from '../../services/store';

import { fetchFeed } from '../../services/Feed/feedThunks';
import {
  selectOrders,
  selectLoading,
  selectError
} from '../../services/Feed/feedSlice';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state: RootState) => selectOrders(state));
  const loading = useSelector((state: RootState) => selectLoading(state));
  const error = useSelector((state: RootState) => selectError(state));

  useEffect(() => {
    if (orders.length === 0) {
      dispatch(fetchFeed());
    }
  }, [dispatch, orders.length]);

  if (loading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <div className='text text_type_main-medium pt-4'>{String(error)}</div>
    );
  }

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeed())} />
  );
};
