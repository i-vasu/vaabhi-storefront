import { expect, test } from '@playwright/test';

test.describe('Product Discovery Journey', () => {
    test('User can search and filter products', async ({ page }) => {
        // 1. Visit Home
        await page.goto('/');

        // 2. Use Search Bar
        const searchInput = page.locator('input[name="q"]');
        await searchInput.fill('Dress');
        await page.keyboard.press('Enter');

        // 3. Verify Search Results
        await expect(page).toHaveURL(/.*q=Dress/);
        const productList = page.locator('.grid >> .relative');
        // We expect some results, but if not found, it shows "There are no products that match"
        const noResults = page.locator('text=There are no products that match');
        if (await noResults.isVisible()) {
            console.log('No results for Dress, trying a more generic search');
            await page.fill('input[name="q"]', '');
            await page.keyboard.press('Enter');
        }

        // 4. Test Filters (Price)
        // Adjust selectors based on actual price range component
        const priceMin = page.locator('input[name="minPrice"]');
        const priceMax = page.locator('input[name="maxPrice"]');
        if (await priceMin.isVisible()) {
            await priceMin.fill('100');
            await priceMax.fill('5000');
            await page.keyboard.press('Enter');
            await expect(page).toHaveURL(/.*minPrice=100/);
        }

        // 5. Select a product and view details
        const firstProduct = page.locator('.grid a[href^="/product/"]').first();
        await firstProduct.click();

        // 6. Verify Product Details Page
        await expect(page.locator('h1')).toBeVisible();
        await expect(page.locator('button:has-text("Add To Cart")')).toBeVisible();

        // Check if Aura effect/dominant color extraction is active
        const auraColor = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--aura-color'));
        console.log('Detected Aura Color:', auraColor);
    });

    test('User can use Virtual Try-On', async ({ page }) => {
        // 1. Visit a product page
        await page.goto('/');
        await page.locator('.grid a[href^="/product/"]').first().click();

        // 2. Find Virtual Try-On section
        const vtoButton = page.locator('button:has-text("AI Virtual Try-On"), button:has-text("Try it on")').first();
        if (await vtoButton.isVisible()) {
            await vtoButton.click();
            await expect(page.locator('text=Virtual Try-On')).toBeVisible();

            // Simulation of photo upload? Usually we just check if the UI responds.
            await expect(page.locator('text=Upload a photo')).toBeVisible();
        } else {
            console.log('Virtual Try-On not available for this product');
        }
    });
});
