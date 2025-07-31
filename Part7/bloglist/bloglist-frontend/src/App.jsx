import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs } from './reducers/blogReducer'
import { setUser, clearUser } from './reducers/userReducer'
import Users from './components/Users'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from 'react-router-dom'
const App = () => {

    const user = useSelector((state) => state.user)
    const blogFormRef = useRef()
    //offers a reference to the component.
    const dispatch = useDispatch()
    const blogs = useSelector((state) => state.blogs)

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            // setUser(user)
            dispatch(setUser(user))
            blogService.setToken(user.token)
        }
    }, [dispatch])

    useEffect(() => {
        dispatch(initializeBlogs())
    }, [dispatch])


    const handleLogout = async (event) => {
        event.preventDefault()
        window.localStorage.removeItem('loggedBlogappUser')
        dispatch(clearUser())
    }

    if (user === null) {
        return (
            <div>
                <Notification />
                <LoginForm />
            </div>
        )
    }
    const blogView=(
        <div>
            <h2>blogs</h2>            
            <Togglable buttonLabel="Create New Blog" ref={blogFormRef}>
                <BlogForm />
            </Togglable>
            {[...blogs]
                .sort((a, b) => b.likes - a.likes)
                .map((blog) => (
                    <Blog key={blog.id} blog={blog} />
                ))}
        </div>
    )

    return (
        <Router>
            <div>
            <Notification /> 
            <div>
                <p style={{ display: 'inline', marginRight: '10px' }}>
                    {user.username} logged-in
                </p>
                <button
                    className="button"
                    onClick={handleLogout}
                    aria-label="logout-button"
                >
                    log out
                </button>
            </div>
            <nav style={{margin:'1em 0'}}>
                <Link to="/" style={{marginRight:'1em'}}>blogs</Link>
                <Link to="/users">users</Link>
            </nav>
            <Routes>
                <Route path="/" element={blogView}></Route>
                <Route path="/users" element={<Users />}></Route>
            </Routes>
            </div>
        </Router>
    )
}

export default App
