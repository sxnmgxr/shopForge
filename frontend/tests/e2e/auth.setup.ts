import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '.auth/user.json');

setup('authenticate as customer', async ({ page }) => {
  await page.goto('/auth/login');

  await page.getByTestId('email-input').fill('customer@shopforge.com');
  await page.getByTestId('password-input').fill('Customer123!');
  await page.getByTestId('login-button').click();

  // Wait for redirect to homepage
  await expect(page).toHaveURL('/');
  await expect(page.getByTestId('user-name')).toBeVisible();

  // Save auth state so other tests can reuse it
  await page.context().storageState({ path: authFile });
});
