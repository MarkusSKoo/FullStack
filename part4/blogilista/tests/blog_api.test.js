const User = require('../models/user')
const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('all blogs contain identification called id', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach(blog => {
      assert.ok(blog.id)
    })
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const contents = response.body.map(b => b.title)
    assert.strictEqual(contents.includes('New Blog 1'), true)
  })
})

describe('adding a new blog', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)

    await User.deleteMany({})
    const users = await helper.initialUsers()
    await User.insertMany(users)
  })

  test('succeeds with valid data', async () => {
    const users = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const newBlog = {
      title: 'async/await simplifies making async calls',
      author: 'Ada Lovelace',
      url: 'www.whowouldhavebelieved.fi',
      likes: 100,
      userId: users.body[0].id
    }

    const loginResponse = await api.post('/api/login').send(
      {
        username: users.body[0].username,
        password: 'Verysecretpassword'
      }
    )

    const token = loginResponse.body.token

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const contents = blogsAtEnd.map(b => b.title)
    assert(contents.includes('async/await simplifies making async calls'))
  })

  test('sets likes to 0 if likes is not initialized', async () => {
    const users = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const newBlog = {
      title: 'This blog does not have likes',
      author: 'Ada Lovelace',
      url: 'www.whowouldhavebelieved.fi',
      userId: users.body[0].id
    }

    const loginResponse = await api.post('/api/login').send(
      {
        username: users.body[0].username,
        password: 'Verysecretpassword'
      }
    )

    const token = loginResponse.body.token

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const addedBlog = blogsAtEnd.find(
      b => b.title === 'This blog does not have likes'
    )

    assert.strictEqual(addedBlog.likes, 0)
  })

  test('fails if title is not added', async () => {
    const users = await helper.usersInDb()
    const loginResponse = await api.post('/api/login').send(
      {
        username: users[0].username,
        password: 'Verysecretpassword'
      }
    )

    const token = loginResponse.body.token

    const newBlog = {
      author: 'Ada Lovelace',
      url: 'www.whowouldhavebelieved.fi',
      likes: 100,
      userId: users[0].id
    }

    const result = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('title or url missing'))

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('fails if url is not added', async () => {
    const users = await helper.usersInDb()

    const loginResponse = await api.post('/api/login').send(
      {
        username: users[0].username,
        password: 'Verysecretpassword'
      }
    )

    const token = loginResponse.body.token

    const newBlog = {
      title: 'this blog is missing url',
      author: 'Ada Lovelace',
      likes: 100,
      userId: users[0].id
    }

    const result = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    assert(result.body.error.includes('title or url missing'))
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('fails with incorrect token', async () => {
    const users = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const newBlog = {
      title: 'async/await simplifies making async calls',
      author: 'Ada Lovelace',
      url: 'www.whowouldhavebelieved.fi',
      likes: 100,
      userId: users.body[0].id
    }

    const result = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    assert(result.body.error.includes('token missing or invalid'))
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })
})

describe('deleting a blog', () => {
  test('succeeds with a valid id', async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})

    const users = await helper.initialUsers()
    const user = new User(users[0])
    const savedUser = await user.save()

    const loginResponse = await api.post('/api/login').send({
      username: savedUser.username,
      password: 'Verysecretpassword'
    })

    const token = loginResponse.body.token
    const blogsWithUser = helper.initialBlogs.map(b => ({
      ...b,
      user: savedUser._id
    }))

    await Blog.insertMany(blogsWithUser)

    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await api.get('/api/blogs')
    assert.strictEqual(blogsAtEnd.body.length, helper.initialBlogs.length - 1)

    const titles = blogsAtEnd.body.map(b => b.title)
    assert.strictEqual(titles.includes(blogToDelete.title), false)
  })
})

describe('updating a blog', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('succeeds with a valid id', async () => {
    const blogs = await api.get('/api/blogs')
    const firstBlog = blogs.body[0]
    const newLikes = firstBlog.likes + 2

    await api
      .patch(`/api/blogs/${firstBlog.id}`)
      .send({ likes: newLikes })
      .expect(200)

    const blogsAtEnd = await api.get('/api/blogs')
    const updatedBlog = blogsAtEnd.body.find(b => b.id === firstBlog.id)

    assert.strictEqual(updatedBlog.likes, newLikes)
  })
})

after(async () => {
  await mongoose.connection.close()
})
