import { useNavigate } from 'react-router-dom'
import { Container, Button, CardContent, Typography, CardActions, Card, Link } from '@mui/material'

const BlogPage = ({ blog, user, updateLikes, removeBlog }) => {
  const navigate = useNavigate()

  if(!blog) {
    return null
  }

  const handleUpdate = () => {
    const newLikes = blog.likes + 1
    const blogObject = {
      user: blog.user.id,
      likes: newLikes,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }
    updateLikes(blog.id, blogObject)
  }

  const handleRemove = () => {
    if (window.confirm(`Remove blog ${blog.title}?`)) {
      removeBlog(blog.id)
      navigate('/')
    }
  }

  const hoverStyleLike = { '&:hover': { bgcolor: 'rgba(14, 14, 224, 0.94)' } }
  const hoverStyleRemove = { '&:hover': { bgcolor: 'rgba(132, 12, 12, 0.94)' } }

  return (
    <Container>
      <Card>
        <CardContent>
          <Typography variant='h5'>{blog.title}</Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 0.5 }}>
            by {blog.author}
          </Typography>
          <Link>{blog.url}</Link>
          <Typography>Added by {blog.user.name}</Typography>
          <Typography>likes: {blog.likes}</Typography>
        </CardContent>
        <CardActions>
          {user &&
          <Button
            color='primary'
            variant='contained'
            onClick={handleUpdate}
            sx={hoverStyleLike}>
            like
          </Button>}
          {user && blog.user.name === user.name &&
          <Button
            color='error'
            variant='contained'
            onClick={handleRemove}
            sx={hoverStyleRemove}>
            remove
          </Button>}
        </CardActions>
      </Card>
    </Container>
  )
}

export default BlogPage