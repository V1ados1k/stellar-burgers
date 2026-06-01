import reducer, {
  fetchStart,
  fetchSuccess,
  fetchError
} from '../../src/services/ingredients/ingredientsSlice';
import { describe, test, expect } from '@jest/globals';

describe('Редьюсер ingredients', () => {
  test('устанавливает loading true при fetchStart', () => {
    const state = reducer(undefined, fetchStart());
    expect(state.loading).toBe(true);
  });

  test('сохраняет данные и отключает loading при fetchSuccess', () => {
    const items = [{ _id: '1', name: 'X' } as any];
    const state = reducer(undefined, fetchSuccess(items));
    expect(state.items).toEqual(items);
    expect(state.loading).toBe(false);
  });

  test('сохраняет ошибку и отключает loading при fetchError', () => {
    const state = reducer(undefined, fetchError('oops'));
    expect(state.error).toBe('oops');
    expect(state.loading).toBe(false);
  });
});
