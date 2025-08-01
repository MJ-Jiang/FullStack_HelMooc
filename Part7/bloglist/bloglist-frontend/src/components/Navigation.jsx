import Nav from 'react-bootstrap/Nav'
import { LinkContainer } from 'react-router-bootstrap'
import { useLocation } from 'react-router-dom'
import './Navigation.css'
import { useSelector, useDispatch } from 'react-redux'
import { clearUser } from '../reducers/userReducer'
import Button from 'react-bootstrap/Button'
import { Navbar } from 'react-bootstrap'

const Navigation = () => {
    const location = useLocation()
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user)
    const handleLogout = async (event) => {
        event.preventDefault()
        window.localStorage.removeItem('loggedBlogappUser')
        dispatch(clearUser())
    }
    const isUserRoute=location.pathname.startsWith('/users')

    return (
        <Navbar bg="dark" variant="dark" className="px-3 mb-3" expand="sm">
            <Nav
                activeKey={location.pathname}
                className="me-auto custom-nav"
                as="ul"
            >
                <Nav.Item as="li">
                    <LinkContainer to="/">
                        <Nav.Link active={location.pathname==='/'}>Blogs</Nav.Link>
                    </LinkContainer>
                </Nav.Item>
                <Nav.Item as="li">
                    <LinkContainer to="/users">
                        <Nav.Link active={isUserRoute}>Users</Nav.Link>
                    </LinkContainer>
                </Nav.Item>
            </Nav>

            {user && (
                <Navbar.Text className="me-2 text-white">
                    {user.username} logged-in
                </Navbar.Text>
            )}
            <Button variant="outline-light" size="sm" onClick={handleLogout}>
                log out
            </Button>
        </Navbar>
    )
}

export default Navigation
