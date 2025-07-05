const Notification = ({ message }) => {
  if (message === null) {
    return null
  }
  const messageStyle={
    color:message.type==='error'?'red':'green',
    background:'lightgrey',
    fontStyle:'italic',
    border: `2px solid ${message.type==='error'?'red':'green'}`
  }
  return (
    <div className={`${message.type}`}
      style={messageStyle}>
      {message.text}
    </div>
  )
}
export default Notification