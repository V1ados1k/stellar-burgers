import { createSlice } from '@reduxjs/toolkit';
import { TConstructorIngredient, TOrder } from '@utils-types';

type TConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
  orderRequest: boolean;
  orderModalData: TOrder | null;
  orderError: string | null;
};

const initialState: TConstructorState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderModalData: null,
  orderError: null
};

const burgerConstructorSlice = createSlice({
  name: 'burgerIngredients',
  initialState,
  reducers: {
    addIngredient(state, action) {
      state.ingredients.push(action.payload);
    },
    removeIngredient(state, action) {
      state.ingredients = state.ingredients.filter(
        (el) => el.id !== action.payload
      );
    },
    setBun(state, action) {
      state.bun = action.payload;
    },
    clearConstructor(state) {
      state.bun = null;
      state.ingredients = [];
    },
    orderRequestStart(state) {
      state.orderRequest = true;
      state.orderError = null;
    },
    orderRequestSuccess(state, action) {
      state.orderRequest = false;
      state.orderModalData = action.payload;
      state.orderError = null;
    },
    orderRequestError(state, action) {
      state.orderRequest = false;
      state.orderError = action.payload;
    },
    closeOrderModal(state) {
      state.orderModalData = null;
    },
    moveIngredientUp(state, action) {
      const index = state.ingredients.findIndex(
        (item) => item.id === action.payload
      );

      if (index <= 0) return;

      const temp = state.ingredients[index];
      state.ingredients[index] = state.ingredients[index - 1];
      state.ingredients[index - 1] = temp;
    },
    moveIngredientDown(state, action) {
      const index = state.ingredients.findIndex(
        (item) => item.id === action.payload
      );

      if (index === -1 || index >= state.ingredients.length - 1) return;

      const temp = state.ingredients[index];
      state.ingredients[index] = state.ingredients[index + 1];
      state.ingredients[index + 1] = temp;
    }
  }
});

export const {
  addIngredient,
  removeIngredient,
  setBun,
  clearConstructor,
  orderRequestStart,
  orderRequestSuccess,
  orderRequestError,
  closeOrderModal,
  moveIngredientUp,
  moveIngredientDown
} = burgerConstructorSlice.actions;

export default burgerConstructorSlice.reducer;
