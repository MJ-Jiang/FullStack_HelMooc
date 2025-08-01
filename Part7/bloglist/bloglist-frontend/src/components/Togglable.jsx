import { useState, useImperativeHandle, forwardRef } from 'react'
import PropTypes from 'prop-types'
import Button from 'react-bootstrap/Button'

const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility,
    }
  })

  return (
    <div>
      {!visible && (
        <div className="d-flex justify-content-end">
            <Button variant="primary" onClick={toggleVisibility}>
                {props.buttonLabel}
            </Button>
        </div>
      )}
      {visible && (
        <div className="togglableContent">
          {props.children(toggleVisibility)}
        </div>
      )}
    </div>
  )
})

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
}
Togglable.displayName = 'Togglable'

export default Togglable


//  <Togglable buttonLabel="Create New Blog">
//   <BlogForm />
//   //props.children = <BlogForm />
//   The child components are the React elements that we define between the opening and closing tags of a component.
// </Togglable>
