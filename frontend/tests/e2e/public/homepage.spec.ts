import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('loads and shows hero section', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/ShopForge/);
    await expect(page.getByTestId('logo')).toBeVisible();
    await expect(page.getByRole('heading', { name: /ShopForge/ })).toBeVisible();
  });

  test('shows Shop Now button linking to products', async ({ page }) => {
    await page.goto('/');
    const shopBtn = page.getByRole('link', { name: 'Shop Now' });
    await expect(shopBtn).toBeVisible();
    await shopBtn.click();
    await expect(page).toHaveURL('/products');
  });

  test('shows featured products section', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Featured Products')).toBeVisible();
    await expect(page.getByTestId('product-grid')).toBeVisible();
  });

  test('navbar has correct links', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('nav-products')).toBeVisible();
    await expect(page.getByTestId('cart-icon')).toBeVisible();
    await expect(page.getByTestId('login-link')).toBeVisible();
  });
});
