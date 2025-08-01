import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs } from './reducers/blogReducer'
import { setUser } from './reducers/userReducer'
import Users from './components/Users'
import UserDetail from './components/UserDetail'
import BlogDetail from './components/BlogDetail'
import Navigation from './components/Navigation'
import Card from 'react-bootstrap/Card'
import { Row, Col } from 'react-bootstrap'
import Container from 'react-bootstrap/Container'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
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
    if (user === null) {
        return (
            <div>
                <Notification />
                <LoginForm />
            </div>
        )
    }
    const blogView = (
        <div className="container mt-4">
            <Card className="mb-4 shadow-sm">
                <Card.Body>
                    <Row className="align-items-start">
                        <Col md={4}>
                            <h2 className="fw-bold">Blog App</h2>
                        </Col>
                        <Col md={8}>
                            <Togglable
                                buttonLabel="Create new"
                                ref={blogFormRef}
                            >
                                {(toggleVisibility) => (
                                    <BlogForm onCancel={toggleVisibility} />
                                )}
                            </Togglable>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {[...blogs]
                .sort((a, b) => b.likes - a.likes)
                .map((blog) => (
                    <Card className="mb-3" key={blog.id}>
                        <Card.Body>
                            <Blog blog={blog} />
                        </Card.Body>
                    </Card>
                ))}
        </div>
    )

    return (
        <Router>
            <div>
                <Notification />
                <Navigation />
                <Container className="mt-4">
                    <Routes>
                        <Route path="/" element={blogView}></Route>
                        <Route path="/users" element={<Users />}></Route>
                        <Route
                            path="/users/:id"
                            element={<UserDetail />}
                        ></Route>
                        <Route
                            path="/blogs/:id"
                            element={<BlogDetail />}
                        ></Route>
                    </Routes>
                </Container>
            </div>
        </Router>
    )
}

export default App
