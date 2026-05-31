import { createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '../../utils/types';
import type { RootState } from '../store';

const initialState = {
  items: [] as TIngredient[],
  loading: false,
  error: null as string | null
};

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    fetchStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchSuccess(state, action) {
      state.loading = false;
      state.items = action.payload;
    },
    fetchError(state, action) {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const { fetchStart, fetchSuccess, fetchError } =
  ingredientsSlice.actions;

export const selectIngredients = (state: RootState) => state.ingredients.items;
export const selectIngredientById = (state: RootState, id: string) =>
  state.ingredients.items.find((item) => item._id === id);
export const selectLoading = (state: RootState) => state.ingredients.loading;
export const selectError = (state: RootState) => state.ingredients.error;

export default ingredientsSlice.reducer;
