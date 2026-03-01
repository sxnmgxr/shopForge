import { test, expect } from '@playwright/test';

test.describe('Products Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/products');
  });

  test('shows product grid', async ({ page }) => {
    await expect(page.getByTestId('product-grid')).toBeVisible();
    const cards = page.getByTestId('product-card');
    await expect(cards.first()).toBeVisible();
    await expect(await cards.count()).toBeGreaterThan(0);
  });

  test('can search for products', async ({ page }) => {
    await page.getByTestId('search-input').fill('headphones');
    await page.waitForTimeout(500); // debounce
    const cards = page.getByTestId('product-card');
    await expect(await cards.count()).toBeGreaterThan(0);
  });

  test('can filter by category', async ({ page }) => {
    await page.getByTestId('category-electronics').click();
    await expect(page.getByTestId('product-grid')).toBeVisible();
    // All visible products should be electronics
    const cards = page.getByTestId('product-card');
    await expect(await cards.count()).toBeGreaterThan(0);
  });

  test('can sort products', async ({ page }) => {
    await page.getByTestId('sort-select').selectOption('price_asc');
    await expect(page.getByTestId('product-grid')).toBeVisible();
  });

  test('product card shows name, price and image', async ({ page }) => {
    const firstCard = page.getByTestId('product-card').first();
    await expect(firstCard.getByTestId('product-name')).toBeVisible();
    await expect(firstCard.getByTestId('product-price')).toBeVisible();
    await expect(firstCard.getByTestId('product-image')).toBeVisible();
  });

  test('clicking product navigates to detail page', async ({ page }) => {
    const firstName = await page.getByTestId('product-name').first().textContent();
    await page.getByTestId('product-name').first().click();

    // heading and basic info should show up
    await expect(page.getByRole('heading', { name: firstName! })).toBeVisible();
    await expect(page.getByTestId('product-image')).toBeVisible();
    await expect(page.getByTestId('product-description')).toBeVisible();
  });
});
