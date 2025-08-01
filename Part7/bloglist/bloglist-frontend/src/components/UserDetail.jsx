import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import ListGroup from 'react-bootstrap/ListGroup'
import { LinkContainer } from 'react-router-bootstrap'
const UserDetail = () => {
    const { id } = useParams()
    const user = useSelector((state) => state.users.find((u) => u.id === id))

    if (!user) return <p>Loading user...</p>
    return (
        <div className='mt-4'>
            <h2 className='mb-3 fw-bold'>{user.username}</h2>
            <h5 className='text-muted'>Added blogs</h5>
             <ListGroup>
        {user.blogs.map((blog) => (
          <LinkContainer to={`/blogs/${blog.id}`} key={blog.id}>
            <ListGroup.Item action>{blog.title}</ListGroup.Item>
          </LinkContainer>
        ))}
      </ListGroup>

        </div>
    )
}
export default UserDetail
