import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import {
  BrowserRouter as Router,
} from 'react-router-dom'

test('renders content', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Test author',
    url: 'www.testurl.com'
  }

  render(<Router><Blog blog={blog} /></Router>)

  const element = screen.getByText(
    'Component testing is done with react-testing-library by Test author', { exact: false }
  )
  expect(element).toBeDefined()
})