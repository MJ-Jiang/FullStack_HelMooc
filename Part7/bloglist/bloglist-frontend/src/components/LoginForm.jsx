import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setUser } from '../reducers/userReducer'
import { showNotification } from '../reducers/notificationReducer'
import loginService from '../services/login'
import blogService from '../services/blogs'

const LoginForm = () => {
    const dispatch = useDispatch()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const handleLogin = async (event) => {
        event.preventDefault()
        try {
            const user = await loginService.login({ username, password })
            window.localStorage.setItem(
                'loggedBlogappUser',
                JSON.stringify(user)
            )
            blogService.setToken(user.token)
            dispatch(setUser(user))
            dispatch(
                showNotification(
                    { text: 'Login successful', type: 'success' },
                    5
                )
            )
            setUsername('')
            setPassword('')
        } catch (error) {
            dispatch(
                showNotification(
                    { text: 'Wrong username or password', type: 'error' },
                    5
                )
            )
        }
    }
    return (
        <form onSubmit={handleLogin}>
            <div>
                <h1>Log in to application</h1>
                username
                <input
                    id="username"
                    type="text"
                    value={username}
                    name="Username"
                    onChange={({ target }) => setUsername(target.value)}
                />
            </div>
            <div>
                password
                <input
                    id="password"
                    type="password"
                    value={password}
                    name="Password"
                    onChange={({ target }) => setPassword(target.value)}
                />
            </div>
            <button id="login-button" type="submit">
                login
            </button>
        </form>
    )
}
export default LoginForm
