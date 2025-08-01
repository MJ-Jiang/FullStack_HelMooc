import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setUser } from '../reducers/userReducer'
import { showNotification } from '../reducers/notificationReducer'
import loginService from '../services/login'
import blogService from '../services/blogs'
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap'
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
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: '100vh' }}
        >
            <Row>
                <Col>
                    <Card className="p-4 shadow">
                        <Card.Body>
                            <Card.Title className="text-center mb-4">
                                Log in to application
                            </Card.Title>
                            <Form onSubmit={handleLogin}>
                                <Form.Group
                                    className="mb-3"
                                    controlId="formUsername"
                                >
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={username}
                                        name="Username"
                                        onChange={({ target }) =>
                                            setUsername(target.value)
                                        }
                                        placeholder="Enter username"
                                    />
                                </Form.Group>

                                <Form.Group
                                    className="mb-3"
                                    controlId="formPassword"
                                >
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={password}
                                        name="Password"
                                        onChange={({ target }) =>
                                            setPassword(target.value)
                                        }
                                        placeholder="Enter password"
                                    />
                                </Form.Group>
                                <div className="d-grid">
                                    <Button variant="primary" type="submit">
                                        login
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}
export default LoginForm
