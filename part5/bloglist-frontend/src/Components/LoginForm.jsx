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

const LoginForm = ({
  username,
  password,
  setUsername,
  setPassword,
  handleLogin
}) => {
  return (
    <div>
      <h1>Log in to application</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            username
            <Input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
              placeholder="Username"
            />
          </label>
        </div>
        <div>
          <label>
            password
            <Input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              placeholder="Password"
            />
          </label>
        </div>
        <Button type="submit">login</Button>
      </form>
    </div>
  )
}

export default LoginForm