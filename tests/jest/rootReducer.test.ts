import store, { rootReducer } from '../../src/services/store';
import { describe, test, expect } from '@jest/globals';

describe('Инициализация rootReducer / store', () => {
  test('содержит ожидаемые топ-уровневые слайсы', () => {
    const state = store.getState();
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('feed');
    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('auth');
    expect(state).toHaveProperty('orders');
  });

  test('возвращает корректное начальное состояние при undefined state и неизвестном экшене', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' } as any);
    expect(state).toEqual(store.getState());
  });
});
