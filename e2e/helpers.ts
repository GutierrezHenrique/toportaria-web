import { Page, expect, APIRequestContext } from '@playwright/test';

export const API_URL = process.env.VITE_API_URL || 'http://localhost:3333/api';

export async function apiLogin(
  ctx: APIRequestContext,
  email: string,
  password: string,
): Promise<string> {
  const res = await ctx.post(`${API_URL}/auth/login`, { data: { email, password } });
  if (!res.ok()) throw new Error(`login failed ${res.status()}`);
  const body = await res.json();
  return body.token;
}

export async function resetSeed(ctx: APIRequestContext) {
  // Relies on seeded users existing; caller should re-run seed on backend between runs.
  return apiLogin(ctx, 'admin@toportaria.com', '123456');
}

export async function uiLogin(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.getByLabel('E-mail').fill(email);
  await page.getByLabel('Senha').fill(password);
  await page.getByRole('button', { name: /Entrar/ }).click();
  await expect(page).not.toHaveURL(/\/login$/);
}
