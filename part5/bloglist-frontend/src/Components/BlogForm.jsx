import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

const Button = styled.button`
  background-color: Bisque;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid Chocolate;
  border-radius: 3px;
`

const Input = styled.input`
  margin: 0.25em;
  width: 300px;  
`

const BlogForm = ({ createBlog }) => {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = event => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
    navigate('/')
  }

  return (
    <div>
      <h2>Create new</h2>
      <form onSubmit={addBlog}>
        <div>
          <label>
            title:
            <Input
              value={title}
              onChange={event => setTitle(event.target.value)}
              placeholder="Blog title"
            />
          </label>
        </div>
        <div>
          <label>
            author:
            <Input
              value={author}
              onChange={event => setAuthor(event.target.value)}
              placeholder="Blog written by"
            />
          </label>
        </div>
        <div>
          <label>
            url:
            <Input
              value={url}
              onChange={event => setUrl(event.target.value)}
              placeholder="Url address"
            />
          </label>
        </div>
        <Button type="submit">create</Button>
      </form>
    </div>
  )
}

export default BlogForm