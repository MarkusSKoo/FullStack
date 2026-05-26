const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://markuskauhanen_db_user:${password}@cluster0.yqxfhl3.mongodb.net/testBlogApp?appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

const Blog = mongoose.model('Blog', blogSchema)

if (process.argv.length === 7) {
  const title = process.argv[3]
  const author = process.argv[4]
  const url = process.argv[5]
  const likes = process.argv[6]


  const blog = new Blog({
    title: title,
    author: author,
    url: url,
    likes: likes
  })

  blog.save().then(() => {
    console.log('blog saved!')
    mongoose.connection.close()
  })

} else {

  Blog.find({}).then((result) => {
    result.forEach((blog) => {
      console.log(blog)
    })
    mongoose.connection.close()
  })
}