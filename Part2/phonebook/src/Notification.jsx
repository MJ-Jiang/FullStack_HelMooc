const Notification = ({ message }) => {
  if (message === null) {
    return null
  }
  const messageStyle={
    color:message.type=='error'?'red':'green',
    background:'lightgrey',
    frontStyle:'italic',
    border: `2px solid ${message.type=='error'?'red':'green'}`
  }
  return (
    <div style={messageStyle}>
      {message.text}
    </div>
  )
}
export default Notification