import { test, expect } from '@playwright/test';

test.describe('Auth', () => {
  test('rejects invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('E-mail').fill('admin@toportaria.com');
    await page.getByLabel('Senha').fill('wrongone');
    await page.getByRole('button', { name: /Entrar/ }).click();
    await expect(page.getByText(/Credenciais inválidas|Erro/i)).toBeVisible();
    await expect(page).toHaveURL(/\/login$/);
  });

  test('admin logs in and reaches dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('E-mail').fill('admin@toportaria.com');
    await page.getByLabel('Senha').fill('123456');
    await page.getByRole('button', { name: /Entrar/ }).click();
    await expect(page).toHaveURL('/');
    await expect(page.getByText('Visão geral')).toBeVisible();
    await expect(page.getByText(/Bom dia/)).toBeVisible();
  });

  test('logout clears session', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('E-mail').fill('admin@toportaria.com');
    await page.getByLabel('Senha').fill('123456');
    await page.getByRole('button', { name: /Entrar/ }).click();
    await expect(page).toHaveURL('/');

    await page.getByTitle('Sair').click();
    await expect(page).toHaveURL(/\/login$/);
  });
});
