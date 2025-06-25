import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })
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
    

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  return (
    <div>

    <h1>Log into application</h1>  
      <form onSubmit={handleLogin}></form>
        <div>
            username
            <input 
            type="text"
            value={username}
            name="Username"
            onChange={({target})=>setUsername(target.value)}
            />
        </div>
        <div>
          password
          <input 
          type="password"
          value="password"
          name="Password"
          onChange={({target})=>setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
    </div>
  )
}


export default App