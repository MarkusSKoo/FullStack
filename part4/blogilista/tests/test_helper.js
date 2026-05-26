const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'New Blog 1',
    author: 'test Author',
    url: 'www.test.fi',
    likes: 5
  },
  {
    title: 'New Blog 2',
    author: 'test Author 2',
    url: 'www.test2.fi',
    likes: 4
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}