import { AppDispatch } from '../store';
import { getFeedsApi } from '@api';
import { fetchSuccess, fetchError, fetchStart } from './feedSlice';

export const fetchFeed = () => async (dispatch: AppDispatch) => {
  dispatch(fetchStart());

  try {
    const data = await getFeedsApi();
    dispatch(fetchSuccess(data));
  } catch (err: any) {
    dispatch(fetchError(err?.message || 'Ошибка загрузки ленты'));
  }
};
