/// <reference types="node" />
import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Интеграционные тесты конструктора бургера', () => {
  const base = process.env.BASE_URL || 'http://localhost:3000';
  const harPath = path.join(__dirname, '..', 'hars', 'backend.har');

  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR(harPath, { update: false });

    await page.context().addInitScript(() => {
      try {
        localStorage.setItem('refreshToken', 'test-refresh-token');
      } catch (error) {
      }
    });

    await page.context().addCookies([
      { name: 'accessToken', value: 'Bearer test-token', url: base }
    ]);
  });

  test.afterEach(async ({ page, context }) => {
    await page.evaluate(() => {
      localStorage.removeItem('refreshToken');
    });
    await context.clearCookies();
  });

  test('Добавление ингредиентов в конструктор', async ({ page }) => {
    await page.goto(base);

    await expect(page.locator('text=Булки')).toBeVisible();

    const addButtons = page.locator('button', { hasText: 'Добавить' });
    await addButtons.first().click();
    await addButtons.nth(1).click();

    const constructorSection = page.locator('[class*="constructor"]');
    await expect(constructorSection.locator('text=Test Bun (верх)')).toBeVisible();
    await expect(constructorSection.locator('text=Test Meat')).toBeVisible();
  });

  test('Открытие и закрытие модального окна ингредиента', async ({ page }) => {
    await page.goto(base);

    const ingredientLink = page.locator('a[href="/ingredients/main-1"]').first();
    await ingredientLink.click();

    const modal = page.locator('[class*="modal"]').first();
    await expect(modal.locator('h3', { hasText: 'Детали ингредиента' })).toBeVisible();
    await expect(modal.locator('h3', { hasText: 'Test Meat' })).toBeVisible();

    const closeButton = modal.locator('button').last();
    await closeButton.click();
    await expect(modal).toBeHidden();

    await ingredientLink.click();
    const modalAgain = page.locator('[class*="modal"]').first();
    await expect(modalAgain.locator('h3', { hasText: 'Детали ингредиента' })).toBeVisible();

    await page.mouse.click(0, 0);
    await expect(modalAgain).toBeHidden();
  });

  test('Оформление заказа и проверка модального окна', async ({ page }) => {
    await page.goto(base);

    const addButtons = page.locator('button', { hasText: 'Добавить' });
    await addButtons.first().click();
    await addButtons.nth(1).click();

    await page.locator('button', { hasText: 'Оформить заказ' }).click();

    const orderModal = page.locator('[class*="modal"]').first();
    await expect(orderModal.locator('h2', { hasText: '123' })).toBeVisible();

    const orderCloseButton = orderModal.locator('button').last();
    await orderCloseButton.click();
    await expect(orderModal).toBeHidden();

    const constructorSection = page.locator('[class*="constructor"]');
    await expect(constructorSection.locator('text=Выберите булки')).toBeVisible();
    await expect(constructorSection.locator('text=Выберите начинку')).toBeVisible();
  });
});
