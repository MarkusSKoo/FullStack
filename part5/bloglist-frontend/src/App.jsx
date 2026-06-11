import { useState, useEffect } from 'react'
import Blog from './Components/Blog'
import Footer from './Components/Footer'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './Components/Notification'
import LoginForm from './Components/LoginForm'
import BlogForm from './Components/BlogForm'
import LoginPage from './Components/LoginPage'
import BlogList from './Components/BlogList'
import { useNavigate } from 'react-router-dom'
import BlogPage from './Components/BlogPage'
import { AppBar, Container, Toolbar, Button } from '@mui/material'

import {
  BrowserRouter as Router,
  Routes, Route, Link,
  useMatch
} from 'react-router-dom'

const App = () => {
  const navigate = useNavigate()
  const [blogs, setBlogs] = useState([])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [notification, setNotification] = useState({
    message: null,
    type: null
  })

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))

      blogService.setToken(user.token)
      setUser(user)

      setNotification({ message: `User ${user.name} logged in`, type: 'success' })
      setTimeout(() => {
        setNotification({ message: null, type: null })
      }, 5000)

      setUsername('')
      setPassword('')

      navigate('/')

    } catch {
      setNotification({ message: 'wrong credentials', type: 'failure' })
      setTimeout(() => {
        setNotification({ message: null, type: null })
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)

    setNotification({ message: 'logged out', type: 'success' })

    setTimeout(() => {
      setNotification({ message: null, type: null })
    }, 5000)
  }

  const addBlog = (blogObject) => {
    blogService.create(blogObject).then(returnedBlog => {
      returnedBlog.user = {
        username: user.username,
        name: user.name,
      }

      setBlogs(blogs.concat(returnedBlog))

      setNotification({ message: `Added blog ${returnedBlog.title}`, type: 'success' })

      setTimeout(() => {
        setNotification({ message: null, type: null })
      }, 5000)
    })
  }

  const updateLikes = (id, blogObject) => {
    blogService.update(id, blogObject).then(returnedBlog => {
      setBlogs(blogs.map(blog => blog.id === returnedBlog.id ? returnedBlog : blog))
    })
  }

  const removeBlog = (id) => {
    blogService.remove(id)
      .then(() => {
        setBlogs(blogs.filter(blog => blog.id !== id))
        setNotification({ message: 'Succesfully removed', type: 'success' })

        setTimeout(() => {
          setNotification({ message: null, type: null })
        }, 5000)
      })

      .catch(error => {
        setNotification({ message: `Error: ${error} deleting blog`, type: 'failure' })
        setTimeout(() => {
          setNotification({ message: null, type: null })
        }, 5000)
      })
  }

  const match = useMatch('/blogs/:id')
  const blog = match
    ? blogs.find(blog => blog.id === match.params.id)
    : null

  const hoverStyle = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/" sx={hoverStyle}>blogs</Button>
          {user && <Button color="inherit" component={Link} to="/create" sx={hoverStyle}>new blog</Button>}
          {!user && <Button color="inherit" component={Link} to="/login" sx={hoverStyle}>login</Button>}
          {user && (<button onClick={handleLogout}>logout</button>
          )}
        </Toolbar>
      </AppBar>

      <Notification notification={notification} />

      <Routes>

        <Route path="/" element={
          <BlogList
            blogs={blogs}
            user={user}
            addBlog={addBlog}
            updateLikes={updateLikes}
            removeBlog={removeBlog}
          />
        } />

        <Route path="/login" element={
          <LoginPage
            user={user}
            username={username}
            password={password}
            setUsername={setUsername}
            setPassword={setPassword}
            handleLogin={handleLogin} />
        } />

        <Route path="/blogs/:id" element={
          <BlogPage blog={blog} user={user} updateLikes={updateLikes} removeBlog={removeBlog} />
        } />

        <Route path="/create" element={
          <BlogForm createBlog={addBlog} />
        } />
      </Routes>
      <Footer />
    </Container>
  )
}

export default App