import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  render(<BlogForm createBlog={createBlog} />)

  const title = screen.getByLabelText('title:')
  const author = screen.getByLabelText('author:')
  const url = screen.getByLabelText('url:')
  const sendButton = screen.getByText('create')

  await user.type(title, 'testing a form with test title...')
  await user.type(author, 'testing a form with test author...')
  await user.type(url, 'testing a form with test url...')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('testing a form with test title...')
  expect(createBlog.mock.calls[0][0].author).toBe('testing a form with test author...')
  expect(createBlog.mock.calls[0][0].url).toBe('testing a form with test url...')
})