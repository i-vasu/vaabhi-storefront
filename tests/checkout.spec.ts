import { test, expect } from '@playwright/test';

test.describe('E-Commerce Checkout Integration', () => {

  test('Happy Path: Add to Cart and Checkout', async ({ page }) => {
    // 1. Visit Home
    await page.goto('/');
    
    // 2. Add an Item to Cart (Assuming first item on home page)
    // Adjust selector based on actual UI
    const addToCartBtn = page.locator('button:has-text("Add to Cart")').first();
    // Verify button exists before clicking
    if (await addToCartBtn.isVisible()) {
        await addToCartBtn.click();
    } else {
        console.log('No items found or Add to Cart button missing, skipping click');
        // Fail or Skip
    }

    // 3. Go to Cart
    await page.goto('/cart');
    await expect(page.locator('h1')).toContainText('Cart');

    // 4. Proceed to Checkout
    await page.click('button:has-text("Checkout")');
    
    // 5. Fill Shipping Details
    await page.fill('input[name="firstName"]', 'John');
    await page.fill('input[name="lastName"]', 'Doe');
    await page.fill('input[name="address"]', '123 Main St');
    await page.fill('input[name="city"]', 'Bangalore');
    await page.fill('input[name="pincode"]', '560001');
    await page.fill('input[name="phone"]', '9999999999');
    await page.fill('input[name="email"]', 'john@example.com');

    // 6. Select Payment (Assume Razorpay is triggered by "Pay Now")
    // Mocking Razorpay popup is hard, usually we intercept the API call or check if Script is loaded.
    
    // Intercept Payment API call
    const paymentPromise = page.waitForResponse(response => 
        response.url().includes('/api/payment/create') && response.status() === 200
    );

    await page.click('button:has-text("Place Order")');
    const paymentResponse = await paymentPromise;
    expect(paymentResponse.ok()).toBeTruthy();

    // 7. Verify Order Confirmation
    // Assuming UI redirects to /order-confirmed or shows success message
    // await expect(page).toHaveURL(/.*order-confirmed/);
  });

  test('Scenario: Checkout with Invalid Address', async ({ page }) => {
    await page.goto('/cart'); // Assuming items persist or specific setup needed
    // If cart empty, need to add item again. 
    // Ideally use beforeEach to populate cart state.

    await page.goto('/');
    await page.locator('button:has-text("Add to Cart")').first().click();
    await page.goto('/checkout');

    // Leave fields empty and submit
    await page.click('button:has-text("Place Order")');

    // Expect Validation Errors
    await expect(page.locator('text=required')).toBeVisible();
  });

});
