import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('home page loads', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Tempus/)
    // Should have posts in the feed
    await expect(page.locator('article').first()).toBeVisible()
  })

  test('explore page loads', async ({ page }) => {
    await page.goto('/explore')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Explore')
    // Should show era cards
    await expect(page.locator('a[href*="/era/"]').first()).toBeVisible()
  })

  test('profiles page loads', async ({ page }) => {
    await page.goto('/profiles')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Profiles')
    // Should show profile cards
    await expect(page.locator('a[href*="/profile/"]').first()).toBeVisible()
  })

  test('search page loads', async ({ page }) => {
    await page.goto('/search')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Search')
    // Should have search input
    await expect(page.getByRole('searchbox')).toBeVisible()
  })

  test('about page loads', async ({ page }) => {
    await page.goto('/about')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('About')
  })

  test('settings page loads', async ({ page }) => {
    await page.goto('/settings')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Settings')
  })
})

test.describe('Era Pages', () => {
  test('american revolution era page loads', async ({ page }) => {
    await page.goto('/era/american-revolution')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('American Revolution')
    // Should show posts
    await expect(page.locator('article').first()).toBeVisible()
  })

  test('ancient rome era page loads', async ({ page }) => {
    await page.goto('/era/ancient-rome')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Ancient Rome')
  })

  test('world war 2 era page loads', async ({ page }) => {
    await page.goto('/era/world-war-2')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('World War II')
  })
})

test.describe('Profile Pages', () => {
  test('profile page loads', async ({ page }) => {
    await page.goto('/profile/thomas-jefferson')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Jefferson')
    // Should show bio
    await expect(page.locator('text=Author')).toBeVisible()
  })

  test('profile shows tabs', async ({ page }) => {
    await page.goto('/profile/thomas-jefferson')
    // Should have tabs
    await expect(page.getByRole('tab', { name: /Posts/i })).toBeVisible()
  })
})

test.describe('Post Pages', () => {
  test('individual post page loads', async ({ page }) => {
    // Get the first post from the home page
    await page.goto('/')
    const firstPost = page.locator('article').first()
    await expect(firstPost).toBeVisible()

    // Get the link to the post
    const postLink = firstPost.locator('a[href*="/post/"]').first()
    if (await postLink.count() > 0) {
      await postLink.click()
      // Should be on a post page
      await expect(page).toHaveURL(/\/post\//)
      // Should show the post content
      await expect(page.locator('article').first()).toBeVisible()
    }
  })
})
