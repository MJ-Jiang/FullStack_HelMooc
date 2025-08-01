import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUsers } from '../reducers/usersReducer'
import { Link } from 'react-router-dom'
import Table from 'react-bootstrap/Table'
const Users = () => {
    const dispatch = useDispatch()
    const users = useSelector((state) => state.users)

    useEffect(() => {
        dispatch(fetchUsers())
    }, [dispatch])

    return (
        <div>
            <h2>Users</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Blogs Created</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>
                                <Link to={`/users/${user.id}`}>
                                    {user.username}
                                </Link>
                            </td>
                            <td>{user.blogs.length}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}

export default Users
