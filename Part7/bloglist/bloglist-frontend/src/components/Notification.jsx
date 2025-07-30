import { useSelector } from "react-redux"
const Notification = () => {
    const message =useSelector((state)=>state.notification)
    //Switch from receiving props to getting messages directly from Redux
    if (message === null) {
        return null
    }
    const messageStyle = {
        color: message.type === 'error' ? 'red' : 'green',
        background: 'lightgrey',
        fontStyle: 'italic',
        border: `2px solid ${message.type === 'error' ? 'red' : 'green'}`,
    }
    return (
        <div
            className={`${message.type}`}
            aria-label="notification-message"
            style={messageStyle}
        >
            {message.text}
        </div>
    )
}
export default Notification
