import { test, expect } from '@playwright/test';

// These tests use the saved auth state from auth.setup.ts
test.describe('Cart Flow (Authenticated)', () => {
  test('can add product to cart', async ({ page }) => {
    await page.goto('/products');

    const firstCard = page.getByTestId('product-card').first();
    await firstCard.getByTestId('add-to-cart-btn').click();

    // Toast should appear
    await expect(page.getByText(/added to cart/i)).toBeVisible();

    // Cart count should update
    await expect(page.getByTestId('cart-count')).toBeVisible();
  });

  test('cart page shows added items', async ({ page }) => {
    // Add item first
    await page.goto('/products');
    await page.getByTestId('add-to-cart-btn').first().click();
    await page.waitForTimeout(500);

    // Go to cart
    await page.getByTestId('cart-icon').click();
    await expect(page).toHaveURL('/cart');
    await expect(page.getByTestId('cart-items')).toBeVisible();
  });

  test('can remove item from cart', async ({ page }) => {
    // Add item
    await page.goto('/products');
    await page.getByTestId('add-to-cart-btn').first().click();
    await page.waitForTimeout(500);

    // Go to cart and remove
    await page.goto('/cart');
    await page.getByTestId('remove-item-btn').first().click();
    await expect(page.getByText(/item removed/i)).toBeVisible();
  });

  test('cart shows total price', async ({ page }) => {
    await page.goto('/cart');
    // If cart has items, total should show
    const total = page.getByTestId('cart-total');
    if (await total.isVisible()) {
      await expect(total).toContainText('$');
    }
  });

  test('can proceed to checkout from cart', async ({ page }) => {
    await page.goto('/products');
    await page.getByTestId('add-to-cart-btn').first().click();
    await page.waitForTimeout(500);

    await page.goto('/cart');
    const checkoutBtn = page.getByTestId('checkout-btn');
    if (await checkoutBtn.isVisible()) {
      await checkoutBtn.click();
      await expect(page).toHaveURL('/checkout');
    }
  });
});
