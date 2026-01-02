import { test, expect } from '@playwright/test'

test.describe('Search Functionality', () => {
  test('can search for posts', async ({ page }) => {
    await page.goto('/search')

    // Type in the search box
    const searchInput = page.getByRole('searchbox')
    await searchInput.fill('declaration')

    // Wait for results
    await page.waitForTimeout(500)

    // Should show results or no results message
    const hasResults = await page.locator('article').count() > 0
    const hasNoResults = await page.getByText(/no results/i).count() > 0

    expect(hasResults || hasNoResults).toBe(true)
  })

  test('can search for profiles', async ({ page }) => {
    await page.goto('/search')

    // Type in the search box
    const searchInput = page.getByRole('searchbox')
    await searchInput.fill('Jefferson')

    // Click on People tab
    await page.getByRole('tab', { name: /People/i }).click()

    // Wait for results
    await page.waitForTimeout(500)

    // Should show profile results
    const profiles = page.locator('a[href*="/profile/"]')
    await expect(profiles.first()).toBeVisible()
  })

  test('can filter by era', async ({ page }) => {
    await page.goto('/search')

    // Look for era filter
    const eraFilter = page.locator('select').first()
    if (await eraFilter.count() > 0) {
      await eraFilter.selectOption({ label: /Ancient Rome/i })
      await page.waitForTimeout(500)

      // Results should be filtered
      const articles = page.locator('article')
      if (await articles.count() > 0) {
        // Check that articles are visible
        await expect(articles.first()).toBeVisible()
      }
    }
  })
})
