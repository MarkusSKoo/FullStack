const Notification = ({ notification }) => {
    if (!notification.message) {
        return null
    }

    if (notification.type === 'success') {
        return (
            <div className="success">
                {notification.message}
            </div>
        )
    }

    else if (notification.type === 'failure') {
        return (
            <div className="failure">
                {notification.message}
            </div>
        )
    }

    return null
}

export default Notification