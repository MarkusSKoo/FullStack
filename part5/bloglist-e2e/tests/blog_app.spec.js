const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await page.getByRole('link', { name: 'login' }).click()

    const usernameLocator = page.getByText('username')
    await expect(usernameLocator).toBeVisible()

    const passwordLocator = page.getByText('password')
    await expect(passwordLocator).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')

      const successDiv = page.locator('.success')
      await expect(successDiv).toContainText('Matti Luukkainen logged in')
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong')

      const errorDiv = page.locator('.failure')
      await expect(errorDiv).toContainText('wrong credentials')
      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')

      const successDiv = page.locator('.success')
      await expect(successDiv).toContainText('Matti Luukkainen logged in')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(
        page,
        'Full stack open',
        'Matti Luukkainen',
        'https://fullstackopen.com'
      )

      const successDiv = page.locator('.success')
      await expect(successDiv).toContainText('Added blog Full stack open')

      await expect(page.getByText('Full stack open by Matti Luukkainen')).toBeVisible()
    })
  
    describe('And database has one blog', () => {
      beforeEach(async ({ page }) => {
        await createBlog(
          page,
          'Full stack open',
          'Matti Luukkainen',
          'https://fullstackopen.com'
        )

        const successDiv = page.locator('.success')
        await expect(successDiv).toContainText('Added blog Full stack open')

        await expect(page.getByText('Full stack open by Matti Luukkainen')).toBeVisible()
      })

      test('Blog can be liked', async ({ page }) => {
        await page.getByRole('link', { name: 'Full stack open by Matti Luukkainen' }).click()
        await expect(page.getByText('likes: 0')).toBeVisible()

        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes: 1')).toBeVisible()
      })

      test('Blog can be deleted', async ({ page }) => {
        await page.getByRole('link', { name: 'Full stack open by Matti Luukkainen' }).click()

        page.once('dialog', window => window.accept())
        await page.getByRole('button', { name: 'remove' }).click()

        const successDiv = page.locator('.success')
        await expect(successDiv).toContainText('Succesfully removed')

        await expect(page.getByText('Full stack open by Matti Luukkainen')).not.toBeVisible()
      })

      test('Another user cannot remove the blog', async ({ page, request }) => {
        await page.getByRole('button', { name: 'logout' }).click()

        await request.post('/api/users', {
          data: {
            name: 'Mikko Mallikainen',
            username: 'mmallikai',
            password: 'tuntematon'
          }
        })

        await page.goto('/')
        await loginWith(page, 'mmallikai', 'tuntematon')
        const successDiv = page.locator('.success')
        await expect(successDiv).toContainText('Mikko Mallikainen logged in')

        await expect(page.getByText('Full stack open by Matti Luukkainen')).toBeVisible()

        await page.getByRole('link', { name: 'Full stack open by Matti Luukkainen' }).click()
        await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
      })

      test('Blogs are sorted by the number of likes', async ({ page }) => {
        await createBlog(
        page,
        'Ohjelmistotuotantokurssi',
        'Matti Luukkainen',
        'https://github.com/ohtukurssi.com'
        )

        await createBlog(
        page,
        'Ohjelmistotuotantoprojekti',
        'Matti Luukkainen',
        'https://github.com/ohtuprojekti'
        )

        await page.goto('/')

        await expect(page.getByText('Full stack open Matti Luukkainen')).toBeVisible()
        const firstBlog = page.locator(".blog").filter({ hasText: 'Full stack open'})
        await firstBlog.getByRole('button', { name: 'show'}).click()

        for (let i = 1; i <= 3; i++) {
          await firstBlog.getByRole('button', { name: 'like'}).click()
          await expect(firstBlog.getByText(`likes: ${i}`)).toBeVisible()
        }

        await expect(page.getByText('Ohjelmistotuotantokurssi Matti Luukkainen')).toBeVisible()
        const secondBlog = page.locator(".blog").filter({ hasText: 'Ohjelmistotuotantokurssi'})
        await secondBlog.getByRole('button', { name: 'show'}).click()

        for (let i = 1; i <= 5; i++) {
          await secondBlog.getByRole('button', { name: 'like'}).click()
          await expect(secondBlog.getByText(`likes: ${i}`)).toBeVisible()
        }

        await expect(page.getByText('Ohjelmistotuotantoprojekti Matti Luukkainen')).toBeVisible()
        const thirdBlog = page.locator(".blog").filter({ hasText: 'Ohjelmistotuotantoprojekti'})
        await thirdBlog.getByRole('button', { name: 'show'}).click()

        for (let i = 1; i <= 10; i++) {
          await thirdBlog.getByRole('button', { name: 'like'}).click()
          await expect(thirdBlog.getByText(`likes: ${i}`)).toBeVisible()
        }

        const allBlogs = await page.locator(".blog").all()
        await expect(allBlogs[0]).toContainText('Ohjelmistotuotantoprojekti')
        await expect(allBlogs[1]).toContainText('Ohjelmistotuotantokurssi')
        await expect(allBlogs[2]).toContainText('Full stack open')
      })
    })
  })
})