import { createContext, useReducer, useContext } from 'react'
import PropTypes from 'prop-types'

const NotificationContext = createContext()
/*createContext() creates a global shared object called Context.
It is like a "state container" that allows to share data between different components without having to pass it layer by layer with props.
*/
const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload
    case 'CLEAR':
      return ''
    default:
      return state
  }
}
export const NotificationProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(notificationReducer, '')

  return (
    <NotificationContext.Provider value={[notification, dispatch]}>
      {children}
    </NotificationContext.Provider>
  )
}

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
}


export const useNotification = () => {
  return useContext(NotificationContext)
}
