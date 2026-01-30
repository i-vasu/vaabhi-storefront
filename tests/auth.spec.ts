import { expect, test } from '@playwright/test';

test.describe('User Authentication Journey', () => {
    test('New user can register and login', async ({ page }) => {
        // 1. Visit Home
        await page.goto('/');

        // 2. Click Login button (usually in header)
        const loginLink = page.locator('a[href="/login"]').first();
        if (await loginLink.isVisible()) {
            await loginLink.click();
        } else {
            await page.goto('/login');
        }

        // 3. Navigate to Register
        const registerLink = page.locator('a[href="/register"]');
        await registerLink.click();
        await expect(page).toHaveURL(/.*register/);

        // 4. Fill Registration Form
        const uniqueEmail = `testuser_${Date.now()}@example.com`;
        await page.fill('input[name="firstName"]', 'Test');
        await page.fill('input[name="lastName"]', 'User');
        await page.fill('input[name="email"]', uniqueEmail);
        await page.fill('input[name="password"]', 'Password123!');
        await page.click('button[type="submit"]');

        // 5. Verify Redirect to Login or Home after registration
        // Depending on logic, it might auto-login or redirect to login
        await expect(page).toHaveURL(/.*(login|home|\/)$/);

        // 6. Login
        await page.goto('/login');
        await page.fill('input[name="email"]', uniqueEmail);
        await page.fill('input[name="password"]', 'Password123!');
        await page.click('button[type="submit"]');

        // 7. Verify Dashboard/Account access
        await expect(page).toHaveURL(/.*(\/|account)$/);
        const accountLink = page.locator('a[href="/account"]');
        await expect(accountLink).toBeVisible();
    });

    test('User can logout', async ({ page }) => {
        // 1. Login first (could use storage state in real scenarios)
        await page.goto('/login');
        await page.fill('input[name="email"]', 'john@example.com'); // Using seeded user
        await page.fill('input[name="password"]', 'Password123!');
        await page.click('button[type="submit"]');

        // 2. Go to Account and Logout
        await page.goto('/account');
        const logoutBtn = page.locator('button:has-text("Logout"), a:has-text("Logout")').first();
        await logoutBtn.click();

        // 3. Verify redirected to login or home
        await expect(page).toHaveURL(/.*(login|\/)$/);
        const loginLink = page.locator('a[href="/login"]').first();
        await expect(loginLink).toBeVisible();
    });
});
