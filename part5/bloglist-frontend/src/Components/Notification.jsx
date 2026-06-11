import { Alert } from '@mui/material'

const Notification = ({ notification }) => {
  if (!notification.message) {
    return null
  }

  if (notification.type === 'success') {
    return (
      <Alert severity="success" style={{ marginTop: 10, marginBottom: 10 }} className="success">
        {notification.message}
      </Alert>
    )
  }

  else if (notification.type === 'failure') {
    return (
      <Alert severity="error" style={{ marginTop: 10, MarginBottom: 10 }} className="failure">
        {notification.message}
      </Alert>
    )
  }

  return null
}

export default Notification