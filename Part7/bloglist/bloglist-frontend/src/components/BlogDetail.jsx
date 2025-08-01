import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { likeBlog, addComment } from '../reducers/blogReducer'
import { useState } from 'react'
import { Card, Button, Form, InputGroup, ListGroup } from 'react-bootstrap'
const BlogDetail = () => {
    const { id } = useParams()
    const blog = useSelector((state) => state.blogs.find((b) => b.id === id))
    const dispatch = useDispatch()
    const [comment, setComment] = useState('')
    if (!blog || !blog.user) {
        return <p>Loading full blog data...</p>
    }
    const handleLike = () => {
        dispatch(likeBlog(blog))
    }
    const handleComment = (e) => {
        e.preventDefault()
        if (comment.trim()) {
            dispatch(addComment(blog.id, comment))
            setComment('')
        }
    }
    return (
        <div className="d-flex justify-content-center mt-4">
            <Card
                style={{ width: '100%', maxWidth: '720px' }}
                className="p-4 shadow-sm"
            >
                <Card.Body>
                    {' '}
                    <h2 className="fw-bold">
                        {blog.title}
                        <small className="text-muted"> {blog.author}</small>
                    </h2>
                    <p>
                        <a
                            href={blog.url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {blog.url}
                        </a>
                    </p>
                    <div className="d-flex align-items-center gap-2 mb-2">
                        <span>{blog.likes} likes</span>
                        <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={handleLike}
                        >
                            like
                        </Button>
                    </div>
                    <p className="text-muted">added by {blog.user.username}</p>
                    <h4 className="mt-4">Comments</h4>
                    <Form onSubmit={handleComment}>
                        <InputGroup className="mb-3">
                            <Form.Control
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Leave a comment... "
                            />
                            <Button type="submit" variant="primary">
                                add comment
                            </Button>
                        </InputGroup>
                    </Form>
                    <ListGroup>
                        {blog.comments.map((c, index) => (
                            <ListGroup.Item key={index}>{c}</ListGroup.Item>
                        ))}
                    </ListGroup>
                </Card.Body>
            </Card>
        </div>
    )
}
export default BlogDetail
