import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      //noteService.setToken(user.token)
    }
  }, [])
  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedNoteappUser',JSON.stringify(user)
      )

      setUser(user)
      setUsername('')
      setPassword('')
      //If the login is successful, the form fields are emptied and the server response (including a token and the user details) is saved to the user field of the application's state.
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }
  const handleLogout=async(event)=>{
     event.preventDefault()
     window.localStorage.removeItem('loggedNoteappUser')
     setUser(null)
  }
    

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])
  const loginForm=()=>(
    <form onSubmit={handleLogin}>
      <div>
        <h1>Log in to application</h1>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )
    

  return (
    <div>
      {user === null ? loginForm() : <div>
        <h2>blogs</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <p>{user.username} logged-in</p>
          <button onClick={handleLogout}>log out</button>
        </div>
       
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>}
    </div>
  )
}


export default App