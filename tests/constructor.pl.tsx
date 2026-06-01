import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('Интеграционные тесты конструктора бургера', () => {
  const base = process.env.BASE_URL || 'http://localhost:3000';

  test.beforeEach(async ({ page }) => {
    const harPath = path.join(__dirname, 'hars', 'backend.har');
    try {
      await page.routeFromHAR({ har: harPath });
    } catch (e) {
      const fixturePath = path.join(__dirname, 'hars', 'ingredients.json');
      const raw = await fs.promises.readFile(fixturePath, 'utf8');
      const data = JSON.parse(raw).ingredients;

      await page.route('**/api/ingredients', (route) =>
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, data })
        })
      );

      await page.route('**/auth/user', (route) =>
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, user: { email: 't@test', name: 'T' } })
        })
      );

      await page.route('**/orders', (route) =>
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, order: { number: 123 } })
        })
      );
    }

    await page.context().addInitScript(() => {
      try {
        localStorage.setItem('refreshToken', 'test-refresh-token');
      } catch (e) {}
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
