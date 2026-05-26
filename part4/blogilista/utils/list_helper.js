const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  let totalAmount = 0
  for (let i = 0; i < blogs.length; i++) {
    totalAmount+= blogs[i].likes
  }

  return totalAmount
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0 || !blogs) {
    return null
  }

  let favorite = blogs[0]

  for (let i = 0; i < blogs.length; i++) {
    if (blogs[i].likes > favorite.likes) {
      favorite = blogs[i]
    }
  }

  return favorite
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0 || !blogs) {
    return null
  }

  const blogsPerAuthor = {}

  for (let i = 0; i < blogs.length; i++) {
    if (blogsPerAuthor[blogs[i].author]) {
      blogsPerAuthor[blogs[i].author] += 1
    }

    else {
      blogsPerAuthor[blogs[i].author] = 1
    }
  }

  let mostActiveAuthor = null
  let maxBlogs = -Infinity

  for (const [author, entries] of Object.entries(blogsPerAuthor)) {
    if (entries > maxBlogs) {
      mostActiveAuthor = author
      maxBlogs = entries
    }
  }

  return {
    author: mostActiveAuthor,
    blogs: maxBlogs
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0 || !blogs) {
    return null
  }

  const mostLikedBlogs = {}

  for (let i = 0; i < blogs.length; i++) {
    if (mostLikedBlogs[blogs[i].author]) {
      mostLikedBlogs[blogs[i].author] += blogs[i].likes
    }

    else {
      mostLikedBlogs[blogs[i].author] = blogs[i].likes
    }
  }

  let mostLikedAuthor = null
  let maxLikes = -Infinity

  for (const [author, likes] of Object.entries(mostLikedBlogs)) {
    if (likes > maxLikes) {
      mostLikedAuthor = author
      maxLikes = likes
    }
  }

  return {
    author: mostLikedAuthor,
    likes: maxLikes
  }
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}