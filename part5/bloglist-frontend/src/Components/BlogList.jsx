import Blog from './Blog'
import Notification from './Notification'
import LoginForm from './LoginForm'
import BlogForm from './BlogForm'

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'

const BlogList = ({
  blogs,
  user,
  updateLikes,
  removeBlog
}) => {
  return (
    <div>
      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map(blog =>
          <Blog key={blog.id} blog={blog} updateLikes={updateLikes} user={user} removeBlog={removeBlog} />
        )}
    </div>
  )
}


export default BlogList