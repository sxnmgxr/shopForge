import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('can login with valid credentials', async ({ page }) => {
    await page.goto('/auth/login');

    await page.getByTestId('email-input').fill('customer@shopforge.com');
    await page.getByTestId('password-input').fill('Customer123!');
    await page.getByTestId('login-button').click();

    await expect(page).toHaveURL('/');
    await expect(page.getByTestId('user-name')).toBeVisible();
    await expect(page.getByTestId('logout-button')).toBeVisible();
  });

  test('shows error on invalid credentials', async ({ page }) => {
    await page.goto('/auth/login');

    await page.getByTestId('email-input').fill('wrong@example.com');
    await page.getByTestId('password-input').fill('wrongpassword');
    await page.getByTestId('login-button').click();

    await expect(page.getByText(/invalid email or password/i)).toBeVisible();
  });

  test('can register a new account', async ({ page }) => {
    const uniqueEmail = `test-${Date.now()}@example.com`;

    await page.goto('/auth/register');
    await page.getByTestId('name-input').fill('Test User');
    await page.getByTestId('email-input').fill(uniqueEmail);
    await page.getByTestId('password-input').fill('TestPass123!');
    await page.getByTestId('register-button').click();

    await expect(page).toHaveURL('/');
    await expect(page.getByTestId('user-name')).toBeVisible();
  });

  test('can logout', async ({ page }) => {
    // Login first
    await page.goto('/auth/login');
    await page.getByTestId('email-input').fill('customer@shopforge.com');
    await page.getByTestId('password-input').fill('Customer123!');
    await page.getByTestId('login-button').click();
    await expect(page).toHaveURL('/');

    // Logout
    await page.getByTestId('logout-button').click();
    await expect(page.getByTestId('login-link')).toBeVisible();
    await expect(page.getByTestId('user-name')).not.toBeVisible();
  });

  test('register link on login page works', async ({ page }) => {
    await page.goto('/auth/login');
    await page.getByRole('link', { name: 'Register here' }).click();
    await expect(page).toHaveURL('/auth/register');
  });
});
