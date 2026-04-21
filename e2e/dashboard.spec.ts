import { test, expect } from '@playwright/test';
import { uiLogin } from './helpers';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await uiLogin(page, 'admin@toportaria.com', '123456');
  });

  test('shows KPI cards and chart', async ({ page }) => {
    await expect(page.getByText('Moradores ativos')).toBeVisible();
    await expect(page.getByText('Taxa de ocupação')).toBeVisible();
    await expect(page.getByText('Movimento últimos 7 dias')).toBeVisible();
    await expect(page.getByText('Aprovações pendentes')).toBeVisible();
  });

  test('sidebar navigation works', async ({ page }) => {
    await page.getByRole('link', { name: /Visitantes/ }).first().click();
    await expect(page).toHaveURL(/\/visitors$/);
    await expect(page.getByRole('heading', { name: 'Visitantes' })).toBeVisible();

    await page.getByRole('link', { name: /Encomendas/ }).click();
    await expect(page).toHaveURL(/\/deliveries$/);

    await page.getByRole('link', { name: /Unidades/ }).click();
    await expect(page).toHaveURL(/\/units$/);

    await page.getByRole('link', { name: /Auditoria/ }).click();
    await expect(page).toHaveURL(/\/access-logs$/);
  });
});
