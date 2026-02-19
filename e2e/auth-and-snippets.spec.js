// e2e/auth-and-snippets.spec.js
const { test, expect } = require('@playwright/test');

const TEST_EMAIL = process.env.TEST_EMAIL || 'test@example.com';
const TEST_PASSWORD = process.env.TEST_PASSWORD || 'test123';

async function login(page) {
  await page.goto('/login');

  await page.getByLabel('Email Address').fill(TEST_EMAIL);
  await page.getByLabel('Password').fill(TEST_PASSWORD);
  await page.getByRole('button', { name: 'Sign In' }).click();

  await expect(
    page.getByRole('heading', { name: 'My Snippets' })
  ).toBeVisible();
}

// Helper: create a snippet via the UI and return its title
async function createSnippet(page, { makePublic = false } = {}) {
  const title = `E2E Test Snippet ${Date.now()}`;

  await page.getByRole('button', { name: 'Add Snippet' }).click();

  await page.getByLabel('Title').fill(title);
  await page.getByLabel('Description').fill('E2E test snippet description');

  await page.getByLabel('Programming Language').click();
  await page.getByRole('option', { name: 'JavaScript' }).click();

  await page.getByLabel('Code').fill('console.log("E2E test");');
  await page
    .getByLabel('Tags (comma-separated)')
    .fill('e2e,playwright');

  if (makePublic) {
    const visibilitySwitch = page.getByLabel('Make this snippet public');
    if (await visibilitySwitch.isVisible()) {
      await visibilitySwitch.check();
    }
  }

  await page.getByRole('button', { name: 'Create' }).click();

  await expect(
    page.getByText('Snippet created successfully!')
  ).toBeVisible();

  await expect(page.getByText(title)).toBeVisible();

  return title;
}

test.describe('AiCodySnippets – auth & snippets', () => {
  test('user can log in and see My Snippets', async ({ page }) => {
    await login(page);
  });

  test('user can create a new snippet via dialog', async ({ page }) => {
    await login(page);

    const title = `E2E Test Snippet ${Date.now()}`;

    await page.getByRole('button', { name: 'Add Snippet' }).click();

    await page.getByLabel('Title').fill(title);
    await page.getByLabel('Description').fill('E2E test snippet description');

    await page.getByLabel('Programming Language').click();
    await page.getByRole('option', { name: 'JavaScript' }).click();

    await page.getByLabel('Code').fill('console.log("E2E test");');
    await page
      .getByLabel('Tags (comma-separated)')
      .fill('e2e,playwright');

    // Optional: make snippet public
    const visibilitySwitch = page.getByLabel('Make this snippet public');
    if (await visibilitySwitch.isVisible()) {
      await visibilitySwitch.check();
    }

    await page.getByRole('button', { name: 'Create' }).click();

    await expect(
      page.getByText('Snippet created successfully!')
    ).toBeVisible();

    await expect(page.getByText(title)).toBeVisible();
  });

  test('user can toggle snippet public / private', async ({ page }) => {
    await login(page);

    const title = await createSnippet(page, { makePublic: false });

    const card = page
      .locator('.MuiCard-root')
      .filter({ hasText: title })
      .first();

    const visibilityToggle = card.locator('button').first();

    await expect(card.locator('[data-testid="VisibilityOffIcon"]')).toBeVisible();

    await visibilityToggle.click();

    await expect(card.locator('[data-testid="VisibilityIcon"]')).toBeVisible();

    await visibilityToggle.click();

    await expect(card.locator('[data-testid="VisibilityOffIcon"]')).toBeVisible();
  });

  test('user can delete a snippet via dialog', async ({ page }) => {
    await login(page);

    const title = await createSnippet(page, { makePublic: false });

    const card = page
      .locator('.MuiCard-root')
      .filter({ hasText: title })
      .first();

    await card.locator('[data-testid="DeleteIcon"]').click();

    await expect(
      page.getByRole('heading', { name: 'Delete Snippet' })
    ).toBeVisible();

    await page.getByRole('button', { name: 'Delete' }).click();

    await expect(
      page
        .locator('.MuiCard-root')
        .filter({ hasText: title })
    ).toHaveCount(0);
  });
});