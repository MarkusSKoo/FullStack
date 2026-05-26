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
  })

  test('succeeds with valid data', async () => {
    const newBlog = {
      title: 'async/await simplifies making async calls',
      author: 'Ada Lovelace',
      url: 'www.whowouldhavebelieved.fi',
      likes: 100
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const contents = blogsAtEnd.map(b => b.title)
    assert(contents.includes('async/await simplifies making async calls'))
  })

  test('sets likes to 0 if likes is not initialized', async () => {
    const newBlog = {
      title: 'This blog does not have likes',
      author: 'Ada Lovelace',
      url: 'www.whowouldhavebelieved.fi',
    }

    await api
      .post('/api/blogs')
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
    const newBlog = {
      author: 'Ada Lovelace',
      url: 'www.whowouldhavebelieved.fi',
      likes: 100
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('fails if url is not added', async () => {
    const newBlog = {
      title: 'this blog is missing url',
      author: 'Ada Lovelace',
      likes: 100
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })
})

describe('deleting a blog', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('succeeds with a valid id', async () => {
    const blogs = await api.get('/api/blogs')
    const firstBlog = blogs.body[0]

    await api
      .delete(`/api/blogs/${firstBlog.id}`)
      .expect(204)

    const blogsAtEnd = await api.get('/api/blogs')
    assert.strictEqual(blogsAtEnd.body.length, helper.initialBlogs.length -1)

    const contents = blogsAtEnd.body.map(b => b.title)
    assert.strictEqual(contents.includes(`${firstBlog.title}`), false)
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
