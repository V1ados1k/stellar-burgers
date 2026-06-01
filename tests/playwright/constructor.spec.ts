import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Интеграционные тесты конструктора бургера', () => {
  const base = process.env.BASE_URL || 'http://localhost:3000';
  const harPath = path.join(__dirname, 'hars', 'backend.har');

  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR({ har: harPath });

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

  test('Добавление ингредиента, открытие/закрытие модального окна и создание заказа', async ({ page }) => {
    await page.goto(base);

    await expect(page.locator('text=Булки')).toBeVisible();

    const addButtons = page.locator('button', { hasText: 'Добавить' });
    await addButtons.first().click();
    await addButtons.nth(1).click();

    await expect(page.locator('text=Test Bun (верх)')).toBeVisible();
    await expect(page.locator('text=Test Meat')).toBeVisible();

    const ingredientLink = page.locator('a[href="/ingredients/main-1"]').first();
    await ingredientLink.click();

    await expect(page.locator('h3', { hasText: 'Детали ингредиента' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Test Meat' })).toBeVisible();

    const title = page.locator('h3', { hasText: 'Детали ингредиента' }).first();
    await title.locator('xpath=..').locator('button').click();
    await expect(page.locator('h3', { hasText: 'Детали ингредиента' })).toBeHidden();

    await ingredientLink.click();
    await expect(page.locator('h3', { hasText: 'Детали ингредиента' })).toBeVisible();

    await page.mouse.click(0, 0);
    await expect(page.locator('h3', { hasText: 'Детали ингредиента' })).toBeHidden();

    await page.locator('button', { hasText: 'Оформить заказ' }).click();
    await expect(page.locator('h2', { hasText: '123' })).toBeVisible();

    const orderTitle = page.locator('h2', { hasText: '123' }).first();
    await orderTitle.locator('xpath=../..').locator('button').click();
    await expect(page.locator('h2', { hasText: '123' })).toBeHidden();

    await expect(page.locator('text=Выберите булки')).toBeVisible();
    await expect(page.locator('text=Выберите начинку')).toBeVisible();
  });
});
