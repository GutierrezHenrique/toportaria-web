import { test, expect } from '@playwright/test';
import { uiLogin, API_URL, apiLogin } from './helpers';

test.describe('Visitors flow', () => {
  test('pending visitor appears in list and can be approved', async ({ page, request }) => {
    // Seed: create a unit + pending visitor via API
    const token = await apiLogin(request, 'admin@toportaria.com', '123456');
    const unitsRes = await request.get(`${API_URL}/units`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const units = await unitsRes.json();
    expect(units.length).toBeGreaterThan(0);
    const unit = units[0];

    const porteiroTok = await apiLogin(request, 'porteiro@toportaria.com', '123456');
    const name = `E2E Visitante ${Date.now()}`;
    await request.post(`${API_URL}/visitors`, {
      headers: { Authorization: `Bearer ${porteiroTok}` },
      data: { name, unitId: unit.id, document: '000.000.000-00' },
    });

    // UI flow
    await uiLogin(page, 'admin@toportaria.com', '123456');
    await page.getByRole('link', { name: /Visitantes/ }).first().click();
    await expect(page).toHaveURL(/\/visitors$/);

    const row = page.getByRole('row', { name: new RegExp(name) });
    await expect(row).toBeVisible();
    await expect(row.getByText(/Aguardando/)).toBeVisible();

    await row.getByRole('button', { name: 'Aprovar' }).click();
    await expect(page.getByText(/Status atualizado/i)).toBeVisible();
    await expect(row.getByText(/Aprovado/)).toBeVisible();

    await row.getByRole('button', { name: 'Check-in' }).click();
    await expect(row.getByText(/Em visita/)).toBeVisible();

    await row.getByRole('button', { name: 'Check-out' }).click();
    await expect(row.getByText(/Finalizado/)).toBeVisible();
  });
});
