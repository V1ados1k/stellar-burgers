import { AppDispatch } from '../store';
import {
  authStart,
  authSuccess,
  authError,
  updateUserStart,
  updateUserSuccess,
  updateUserError,
  logoutSuccess
} from './authSlice';
import {
  loginUserApi,
  registerUserApi,
  getUserApi,
  updateUserApi,
  logoutApi
} from '@api';
import { deleteCookie, setCookie } from '../../utils/cookie';

type TLoginData = {
  email: string;
  password: string;
};

type TRegisterData = {
  email: string;
  name: string;
  password: string;
};

export const loginUser =
  (data: TLoginData) => async (dispatch: AppDispatch) => {
    dispatch(authStart());

    try {
      const response = await loginUserApi(data);
      localStorage.setItem('refreshToken', response.refreshToken);
      setCookie('accessToken', response.accessToken);
      dispatch(authSuccess(response.user));
      return response.user;
    } catch (err: any) {
      dispatch(authError(err?.message || 'Ошибка входа'));
      return Promise.reject(err);
    }
  };

export const registerUser =
  (data: TRegisterData) => async (dispatch: AppDispatch) => {
    dispatch(authStart());

    try {
      const response = await registerUserApi(data);
      localStorage.setItem('refreshToken', response.refreshToken);
      setCookie('accessToken', response.accessToken);
      dispatch(authSuccess(response.user));
      return response.user;
    } catch (err: any) {
      dispatch(authError(err?.message || 'Ошибка регистрации'));
      return Promise.reject(err);
    }
  };

export const fetchUser = () => async (dispatch: AppDispatch) => {
  dispatch(authStart());

  try {
    const response = await getUserApi();
    dispatch(authSuccess(response.user));
    return response.user;
  } catch (err: any) {
    dispatch(authError(err?.message || 'Ошибка получения пользователя'));
  }
};

export const updateUser =
  (data: { name?: string; email?: string; password?: string }) =>
  async (dispatch: AppDispatch) => {
    dispatch(updateUserStart());

    try {
      const response = await updateUserApi(data);
      dispatch(updateUserSuccess(response.user));
      return response.user;
    } catch (err: any) {
      dispatch(
        updateUserError(err?.message || 'Ошибка обновления пользователя')
      );
      return Promise.reject(err);
    }
  };

export const logoutUser = () => async (dispatch: AppDispatch) => {
  try {
    await logoutApi();
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
    dispatch(logoutSuccess());
  } catch (err: any) {
    dispatch(authError(err?.message || 'Ошибка выхода'));
    return Promise.reject(err);
  }
};
