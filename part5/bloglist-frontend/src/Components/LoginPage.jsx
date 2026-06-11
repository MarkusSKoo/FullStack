import Blog from './Blog'
import Notification from './Notification'
import LoginForm from './LoginForm'
import BlogForm from './BlogForm'
import Togglable from './Togglable'

const LoginPage = ({ username, password, setUsername, setPassword, handleLogin }) => {
  return (
    <LoginForm
      username={username}
      password={password}
      setUsername={setUsername}
      setPassword={setPassword}
      handleLogin={handleLogin}
    />
  )
}


export default LoginPage