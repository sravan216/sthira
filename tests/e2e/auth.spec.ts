import { test, expect } from '@playwright/test';

// MOCK CONSTANTS
const BASE_URL = 'http://localhost:5173';

const setupAuth = async (page: any, role: string) => {
  // Inject mock JWT token into localStorage
  const dummyHeader = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString('base64');
  const dummyPayload = Buffer.from(JSON.stringify({ sub: "1", email: `test@${role}.com`, role: role, exp: 9999999999 })).toString('base64');
  const dummyToken = `${dummyHeader}.${dummyPayload}.dummy`;
  
  await page.goto(BASE_URL);
  await page.evaluate((token: string) => {
    localStorage.setItem('access_token', token);
  }, dummyToken);
};

test.describe('Role-Based Access Control E2E', () => {

  test('Household role cannot access /national or /admin', async ({ page }) => {
    await setupAuth(page, 'household');
    
    // Can access own dashboard
    await page.goto(`${BASE_URL}/household/1`);
    await expect(page.locator('text=Household Vulnerability Index')).toBeVisible();

    // Cannot access national
    await page.goto(`${BASE_URL}/national`);
    await expect(page.locator('text=Sthira National Dashboard')).not.toBeVisible();
    await expect(page).toHaveURL(`${BASE_URL}/`); // Should redirect home
    
    // Cannot access admin
    await page.goto(`${BASE_URL}/admin`);
    await expect(page.locator('text=Admin Console')).not.toBeVisible();
    await expect(page).toHaveURL(`${BASE_URL}/`); // Should redirect home
  });

  test('CSR role can access /national but not /admin', async ({ page }) => {
    await setupAuth(page, 'csr');
    
    // Can access national
    await page.goto(`${BASE_URL}/national`);
    await expect(page.locator('text=Sthira National Dashboard')).toBeVisible();
    
    // Cannot access admin
    await page.goto(`${BASE_URL}/admin`);
    await expect(page.locator('text=Admin Console')).not.toBeVisible();
    await expect(page).toHaveURL(`${BASE_URL}/`); // Should redirect home
  });

  test('Admin role has full access', async ({ page }) => {
    await setupAuth(page, 'admin');
    
    // Can access admin
    await page.goto(`${BASE_URL}/admin`);
    await expect(page.locator('text=Admin Console')).toBeVisible();
    await expect(page.locator('text=Support Programs')).toBeVisible();
    
    // Can access national
    await page.goto(`${BASE_URL}/national`);
    await expect(page.locator('text=Sthira National Dashboard')).toBeVisible();
  });

});
