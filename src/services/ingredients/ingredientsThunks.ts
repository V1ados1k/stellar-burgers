import { AppDispatch } from '../store';
import { getIngredientsApi } from '../../utils/burger-api';
import { fetchStart, fetchSuccess, fetchError } from './ingredientsSlice';

export const fetchIngredients = () => async (dispatch: AppDispatch) => {
  dispatch(fetchStart());

  try {
    const data = await getIngredientsApi();
    dispatch(fetchSuccess(data));
  } catch (err: any) {
    dispatch(fetchError(err.message));
  }
};
