import reducer, {
  addIngredient,
  removeIngredient,
  setBun,
  clearConstructor,
  moveIngredientUp,
  moveIngredientDown
} from '../../src/services/burgerConstructor/burgerConstructorSlice';
import { describe, test, expect } from '@jest/globals';

describe('Редьюсер burgerConstructor', () => {
  const ingredient = {
    _id: 'main-1',
    id: 'main-1-abc',
    name: 'Test Meat',
    type: 'main',
    price: 200,
    image: 'img'
  } as any;

  test('добавляет ингредиент', () => {
    const state = reducer(undefined, addIngredient(ingredient));
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0].name).toBe('Test Meat');
  });

  test('удаляет ингредиент', () => {
    const withItem = {
      bun: null,
      ingredients: [ingredient],
      orderRequest: false,
      orderModalData: null,
      orderError: null
    } as any;
    const state = reducer(withItem, removeIngredient(ingredient.id));
    expect(state.ingredients).toHaveLength(0);
  });

  test('устанавливает булку и очищает конструктор', () => {
    const bun = {
      _id: 'bun-1',
      name: 'Test Bun',
      type: 'bun',
      price: 100
    } as any;
    const stateWithBun = reducer(undefined, setBun(bun));
    expect(stateWithBun.bun).toEqual(bun);

    const cleared = reducer(stateWithBun, clearConstructor());
    expect(cleared.bun).toBeNull();
    expect(cleared.ingredients).toHaveLength(0);
  });

  test('перемещает ингредиент вверх и вниз', () => {
    const a = { ...ingredient, id: 'a' } as any;
    const b = { ...ingredient, id: 'b' } as any;
    const state = {
      bun: null,
      ingredients: [a, b],
      orderRequest: false,
      orderModalData: null,
      orderError: null
    } as any;

    const movedUp = reducer(state, moveIngredientUp('b'));
    expect(movedUp.ingredients[0].id).toBe('b');

    const movedDown = reducer(movedUp, moveIngredientDown('b'));
    expect(movedDown.ingredients[1].id).toBe('b');
  });
});
