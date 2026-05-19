import { createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import type { RootState } from '../store';

interface AuthState {
  user: TUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  updateUserError: string | null;
  authCheckLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  updateUserError: null,
  authCheckLoading: true
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authStart(state) {
      state.loading = true;
      state.error = null;
    },
    authSuccess(state, action) {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
      state.authCheckLoading = false;
    },
    authError(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.authCheckLoading = false;
    },
    updateUserStart(state) {
      state.loading = true;
      state.updateUserError = null;
    },
    updateUserSuccess(state, action) {
      state.loading = false;
      state.user = action.payload;
      state.updateUserError = null;
    },
    updateUserError(state, action) {
      state.loading = false;
      state.updateUserError = action.payload;
    },
    logoutSuccess(state) {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.updateUserError = null;
      state.authCheckLoading = false;
    },
    authCheckStart(state) {
      state.authCheckLoading = true;
      state.error = null;
    }
  }
});

export const {
  authStart,
  authSuccess,
  authError,
  updateUserStart,
  updateUserSuccess,
  updateUserError,
  logoutSuccess,
  authCheckStart
} = authSlice.actions;

export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectUpdateUserError = (state: RootState) =>
  state.auth.updateUserError;

export default authSlice.reducer;
