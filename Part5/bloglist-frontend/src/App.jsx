import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const[title,setTitle]=useState('')
  const[author,setAuthor]=useState('')
  const[url,setUrl]=useState('')
  const[errorMessage,setErrorMessage]=useState(null)
  const[message,setMessage]=useState(null)
  
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
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
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      //If the login is successful, the form fields are emptied and the server response (including a token and the user details) is saved to the user field of the application's state.
    } catch (exception) {
      setMessage({text:"Wrong username or password",type:'error'})
      setTimeout(()=>{setMessage(null)},5000)
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
    
  const handleNewBlog=async(event)=>{
    event.preventDefault()
    try{
      const newBlog={title,author,url}
      const returnedBlog=await  blogService.create(newBlog)
      setBlogs(blogs.concat(returnedBlog))
      setTitle('')
      setAuthor('')
      setUrl('')
      setMessage({text:`A new blog "${title}" by ${author} added`,type:'success'})
      setTimeout(()=>{setMessage(null)},5000)

    }catch(error){
      console.error('error creating blog:',error)
    }
   

  }


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
  const loginState=()=>(

  
    <div>
        <h2>blogs</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <p>{user.username} logged-in</p>
          <button onClick={handleLogout}>log out</button>
    </div>
   
    <h3>Create new</h3>
    <form onSubmit={handleNewBlog}>
      title:
      <input 
      type='text'
      value={title}
      name='title'
      onChange={({target})=>setTitle(target.value)}
      />
      <br/>
      author:
       <input 
      type='text'
      value={author}
      name='author'
      onChange={({target})=>setAuthor(target.value)}
      />
       <br/>
      url:
       <input 
      type='text'
      value={url}
      name='url'
      onChange={({target})=>setUrl(target.value)}
      />
    
      <br/>
      <button type="submit">Create</button>
      </form>
    
       
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
  )
  
    

  return (
    <div>
      <Notification message={message} />
      {user === null ? loginForm() : loginState()}
    </div>
  )
}


export default App