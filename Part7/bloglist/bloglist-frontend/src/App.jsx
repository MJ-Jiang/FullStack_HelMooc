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
const App = () => {
    //const [blogs, setBlogs] = useState([])
    //const [username, setUsername] = useState('')
    //const [password, setPassword] = useState('')
    // const [user, setUser] = useState(null)
    const user = useSelector((state) => state.user)
    //const [message, setMessage] = useState(nul(state)=>state.user))
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
    // useEffect(() => {
    //     blogService.getAll().then((blogs) => setBlogs(blogs))
    // }, [])
    useEffect(() => {
        dispatch(initializeBlogs())
    }, [dispatch])
    // const handleLogin = async (event) => {
    //     event.preventDefault()
    //     try {
    //         const user = await loginService.login({
    //             username,
    //             password,
    //         })

    //         window.localStorage.setItem(
    //             'loggedBlogappUser',
    //             JSON.stringify(user)
    //         )
    //         blogService.setToken(user.token)
    //         setUser(user)
    //         setUsername('')
    //         setPassword('')
    //         //If the login is successful, the form fields are emptied and the server response (including a token and the user details) is saved to the user field of the application's state.
    //     } catch (exception) {
    //         dispatch(
    //             showNotification(
    //                 {
    //                     text: 'Wrong username or password',
    //                     type: 'error',
    //                 },
    //                 5
    //             )
    //         )
    //     }
    // }
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
    return (
        <div>
            <Notification />
            <h2>blogs</h2>
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
}

export default App
