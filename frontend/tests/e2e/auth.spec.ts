import { test, expect } from '@playwright/test';

const admin = { email: 'admin@shopforge.com', password: 'Admin123!' };
const customer = { email: 'customer@shopforge.com', password: 'Customer123!' };

test.describe('Authentication', () => {
  test('customer login redirects to account page', async ({ page }) => {
    await page.goto('/auth/login');
    await page.getByTestId('email-input').fill(customer.email);
    await page.getByTestId('password-input').fill(customer.password);
    await page.getByTestId('login-button').click();
    await expect(page).toHaveURL(/\/account$/);
    await expect(page.getByText('My Account')).toBeVisible();
  });

  test('admin login redirects to admin page', async ({ page }) => {
    await page.goto('/auth/login');
    await page.getByTestId('email-input').fill(admin.email);
    await page.getByTestId('password-input').fill(admin.password);
    await page.getByTestId('login-button').click();
    await expect(page).toHaveURL(/\/admin$/);
    await expect(page.getByText('Admin Dashboard')).toBeVisible();
  });
});
