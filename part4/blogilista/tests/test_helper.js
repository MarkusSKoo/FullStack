const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

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

const initialUsers = async () => {
  const passwordHash = await bcrypt.hash('Verysecretpassword', 10)

  return [
    {
      'username': 'MattiM',
      'name': 'Matti Meikäläinen',
      'passwordHash': passwordHash
    }
  ]
}

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

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs, initialUsers, nonExistingId, blogsInDb, usersInDb
}