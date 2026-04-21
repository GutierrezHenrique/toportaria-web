import { test, expect } from '@playwright/test';
import { uiLogin } from './helpers';

test.describe('Units CRUD', () => {
  test('admin adds a unit', async ({ page }) => {
    await uiLogin(page, 'admin@toportaria.com', '123456');
    await page.getByRole('link', { name: /Unidades/ }).click();
    await expect(page).toHaveURL(/\/units$/);

    const block = 'E';
    const number = `${Math.floor(Math.random() * 900) + 100}`;
    await page.getByLabel('Bloco').fill(block);
    await page.getByLabel('Número').fill(number);
    await page.getByRole('button', { name: /Adicionar/ }).click();

    await expect(page.getByText(/Unidade criada/i)).toBeVisible();
    await expect(page.getByText(new RegExp(`Bloco ${block}.*Ap ${number}`))).toBeVisible();
  });
});
