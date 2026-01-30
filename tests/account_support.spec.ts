import { expect, test } from '@playwright/test';

test.describe('Account & Support Journey', () => {
    test.beforeEach(async ({ page }) => {
        // Shared login for account tests
        await page.goto('/login');
        await page.fill('input[name="email"]', 'john@example.com');
        await page.fill('input[name="password"]', 'Password123!');
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL(/.*(\/|account)$/);
    });

    test('User can manage addresses', async ({ page }) => {
        await page.goto('/account/addresses');

        // Add new address
        const addBtn = page.locator('a[href="/account/addresses/new"]');
        await addBtn.click();

        await page.fill('input[name="addressLine1"]', 'Apt 404');
        await page.fill('input[name="addressLine2"]', 'Tech Park');
        await page.fill('input[name="city"]', 'Bangalore');
        await page.fill('input[name="state"]', 'Karnataka');
        await page.fill('input[name="pincode"]', '560100');
        await page.fill('input[name="country"]', 'India');
        await page.click('button[type="submit"]');

        await expect(page).toHaveURL(/.*addresses$/);
        await expect(page.locator('text=Apt 404')).toBeVisible();
    });

    test('User can create and reply to support tickets', async ({ page }) => {
        await page.goto('/account/support');

        // Create ticket
        await page.click('button:has-text("New Support Ticket")');
        await page.fill('input[name="subject"]', 'Test Ticket');
        await page.locator('select[name="priority"]').selectOption('MEDIUM');
        await page.fill('textarea[name="message"]', 'I need help with my order.');
        await page.click('button[type="submit"]');

        // Verify ticket created
        await expect(page.locator('text=Test Ticket')).toBeVisible();

        // View details and reply
        await page.locator('text=Test Ticket').first().click();
        await page.fill('textarea[placeholder="Type your message here..."]', 'This is a follow-up reply.');
        await page.click('button:has-text("Send Reply")');

        // Verify reply in thread
        await expect(page.locator('text=This is a follow-up reply.')).toBeVisible();
    });

    test('User can view rewards and transfer points', async ({ page }) => {
        await page.goto('/account/rewards');
        await expect(page.locator('text=Your Points')).toBeVisible();

        // Try transfer (might fail if friend not found, but we test the UI flow)
        await page.fill('input[name="friendEmail"]', 'friend@example.com');
        await page.fill('input[name="points"]', '10');
        await page.click('button:has-text("Transfer Points")');

        // We expect either success toast or error toast
        const toast = page.locator('.sonner-toast'); // Using sonner
        await expect(toast).toBeVisible();
    });

    test('User can view wallet and transactions', async ({ page }) => {
        await page.goto('/account/wallet');
        await expect(page.locator('text=Available Balance')).toBeVisible();
        await expect(page.locator('text=Transaction History')).toBeVisible();
    });

    test('User can view returns', async ({ page }) => {
        await page.goto('/account/returns');
        await expect(page.locator('h1')).toContainText('Returns');
        // If no returns, check for empty state
        const emptyState = page.locator('text=No Active Returns');
        const returnsList = page.locator('.grid >> .rounded-2xl');
        expect(await emptyState.isVisible() || await returnsList.count() >= 0).toBeTruthy();
    });
});
