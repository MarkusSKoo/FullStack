const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async(request, response) => {
  const blogs = await Blog
    .find ({}).populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const user = request.user
  const body = request.body

  if (!body.title || !body.url) {
    return response.status(400).json({ error: 'title or url missing' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async(request, response) => {
  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  if (!blog.user) {
    return response.status(400).json({ error: 'blog has no user' })
  }

  const user = request.user

  if ( blog.user.toString() === user.id.toString() ) {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()

  } else {
    response.status(401).json({ error: 'unauthorized' })
  }
})

blogsRouter.patch('/:id', async(request, response) => {
  const id = request.params.id
  const likes = request.body.likes

  const updatedBlog = await Blog
    .findByIdAndUpdate(id, { likes: likes }, { returnDocument: 'after' })

  response.status(200).json(updatedBlog)
})

module.exports = blogsRouter