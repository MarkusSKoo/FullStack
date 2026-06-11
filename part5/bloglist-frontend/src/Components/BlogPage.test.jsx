import { render, screen } from '@testing-library/react'
import BlogPage from './BlogPage'
import {
  BrowserRouter as Router,
} from 'react-router-dom'
import userEvent from '@testing-library/user-event'

test('BlogPage renders full blog information when logged in', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Test author',
    url: 'www.testurl.com',
    likes: 5,
    user: {
      username: 'Testuser',
      name: 'Test user',
    }
  }

  const user = {
    username: 'Testuser',
    name: 'Test user',
  }

  const mockHandler = vi.fn()

  render(
    <Router>
      <BlogPage blog={blog} user={user} updateLikes={mockHandler} removeBlog={mockHandler}  />
    </Router>
  )

  const titleElement = screen.getByText('title: Component testing is done with react-testing-library', { exact: false })
  expect(titleElement).toBeDefined()

  const likesElement = screen.getByText( 'likes: 5', { exact: false } )
  expect(likesElement).toBeDefined()

  const urlElement = screen.getByText( 'www.testurl.com', { exact: false } )
  expect(urlElement).toBeDefined()

  const userElement = screen.getByText( 'user: Test user', { exact: false } )
  expect(userElement).toBeDefined()

  const likeButtonElement = screen.getByRole('button', { name: 'like' })
  expect(likeButtonElement).toBeDefined()

  const removeButtonElement = screen.getByRole('button', { name: 'remove' })
  expect(removeButtonElement).toBeDefined()
})

test('BlogPage renders full blog information and no buttons when not logged in', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Test author',
    url: 'www.testurl.com',
    likes: 5,
    user: {
      username: 'Testuser',
      name: 'Test user',
    }
  }

  const mockHandler = vi.fn()

  render(
    <Router>
      <BlogPage blog={blog} user={null} updateLikes={mockHandler} removeBlog={mockHandler}  />
    </Router>
  )

  const titleElement = screen.getByText('title: Component testing is done with react-testing-library', { exact: false })
  expect(titleElement).toBeDefined()

  const likesElement = screen.getByText( 'likes: 5', { exact: false } )
  expect(likesElement).toBeDefined()

  const urlElement = screen.getByText( 'www.testurl.com', { exact: false } )
  expect(urlElement).toBeDefined()

  const userElement = screen.getByText( 'user: Test user', { exact: false } )
  expect(userElement).toBeDefined()

  const likeButton = screen.queryByText('like')
  expect(likeButton).toBeNull()

  const removeButtonElement = screen.queryByText('remove')
  expect(removeButtonElement).toBeNull()
})

test('BlogPage renders like button, but no remove when not logged in as not blog owner', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Test author',
    url: 'www.testurl.com',
    likes: 5,
    user: {
      username: 'Testuser',
      name: 'Test user',
    }
  }

  const user = {
    username: 'Anotheruser',
    name: 'Another user',
  }

  const mockHandler = vi.fn()

  render(
    <Router>
      <BlogPage blog={blog} user={user} updateLikes={mockHandler} removeBlog={mockHandler}  />
    </Router>
  )

  const titleElement = screen.getByText('title: Component testing is done with react-testing-library', { exact: false })
  expect(titleElement).toBeDefined()

  const likesElement = screen.getByText( 'likes: 5', { exact: false } )
  expect(likesElement).toBeDefined()

  const urlElement = screen.getByText( 'www.testurl.com', { exact: false } )
  expect(urlElement).toBeDefined()

  const userElement = screen.getByText( 'user: Test user', { exact: false } )
  expect(userElement).toBeDefined()

  const likeButtonElement = screen.getByRole('button', { name: 'like' })
  expect(likeButtonElement).toBeDefined()

  const removeButtonElement = screen.queryByText('remove')
  expect(removeButtonElement).toBeNull()
})

test('clicking the button twice calls event handler twice', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Test author',
    url: 'www.testurl.com',
    likes: 5,
    user: {
      username: 'Testuser',
      name: 'Test user',
    }
  }

  const user = {
    username: 'Testuser',
    name: 'Test user',
  }

  const mockHandler = vi.fn()

  render(
    <Router>
      <BlogPage blog={blog} user={user} updateLikes={mockHandler} removeBlog={mockHandler}  />
    </Router>
  )

  const userForTest = userEvent.setup()

  const likeButton = screen.getByText('like')
  await userForTest.click(likeButton)
  await userForTest.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})