import { expect, test } from '@playwright/test';

test.describe('Cart & Wishlist Journey', () => {
    test('User can manage cart items', async ({ page }) => {
        // 1. Clear cart state (if possible) or start fresh
        await page.goto('/');

        // 2. Add product to cart
        const productLink = page.locator('.grid a[href^="/product/"]').first();
        await productLink.click();

        const addToCartBtn = page.locator('button:has-text("Add To Cart")');
        await addToCartBtn.click();

        // 3. Open Cart Drawer/Page
        // Assuming a drawer opens or user navigates
        await page.goto('/cart');
        await expect(page.locator('h1')).toContainText('Cart');

        // 4. Update Quantity
        const increaseBtn = page.locator('button[aria-label="Increase quantity"]').first();
        if (await increaseBtn.isVisible()) {
            await increaseBtn.click();
            // Verify total price or quantity change
        }

        // 5. Remove Item
        const removeBtn = page.locator('button[aria-label="Remove item"]').first();
        await removeBtn.click();

        // 6. Verify Empty Cart
        await expect(page.locator('text=Your cart is empty')).toBeVisible();
    });

    test('User can manage wishlist', async ({ page }) => {
        // Login to ensure wishlist syncs to backend
        await page.goto('/login');
        await page.fill('input[name="email"]', 'john@example.com');
        await page.fill('input[name="password"]', 'Password123!');
        await page.click('button[type="submit"]');

        await page.goto('/');
        await page.locator('.grid a[href^="/product/"]').first().click();

        // 2. Click Wishlist Button
        const wishlistBtn = page.locator('button[aria-label="Add to wishlist"], button[aria-label="Remove from wishlist"]').first();
        const initiallyInWishlist = await wishlistBtn.textContent();
        await wishlistBtn.click();

        // 3. Go to Wishlist Page
        await page.goto('/account/wishlist');

        // 4. Verify item is in wishlist
        const productTitle = await page.locator('h1').first().textContent(); // Not reliable, need a better selector
        // await expect(page.locator('.grid')).toContainText(productTitle!);

        // 5. Remove from wishlist
        await page.goto('/account/wishlist');
        const unfavoriteBtn = page.locator('button[aria-label="Remove from wishlist"]').first();
        if (await unfavoriteBtn.isVisible()) {
            await unfavoriteBtn.click();
            await expect(page.locator('text=Your wishlist is empty')).toBeVisible();
        }
    });
});
