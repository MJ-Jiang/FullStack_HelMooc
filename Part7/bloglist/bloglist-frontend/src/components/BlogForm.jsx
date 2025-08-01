import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { showNotification } from '../reducers/notificationReducer'
import { createBlog } from '../reducers/blogReducer'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
const BlogForm = ({ onCancel }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')
    const dispatch = useDispatch()
    const handleNewBlog = async (event) => {
        event.preventDefault()
        try {
            const newBlog = { title, author, url }
            await dispatch(createBlog(newBlog))
            // setBlogs(blogs.concat(returnedBlog))
            setTitle('')
            setAuthor('')
            setUrl('')
            dispatch(
                showNotification(
                    {
                        text: `A new blog "${title}" by ${author} added`,
                        type: 'success',
                    },
                    5
                )
            )
        } catch (error) {
            console.error('error creating blog:', error)
        }
    }
    return (
        <Form onSubmit={handleNewBlog} className="p-3 bg-light rounded">
            <h3 className="mb-4">Create New Blog</h3>

            <Form.Group as={Row} className="mb-3" controlId="formTitle">
                <Form.Label column sm={2}>
                    Title
                </Form.Label>
                <Col sm={10}>
                    <Form.Control
                        type="text"
                        placeholder="Enter blog title"
                        value={title}
                        onChange={({ target }) => setTitle(target.value)}
                    />
                </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formAuthor">
                <Form.Label column sm={2}>
                    Author
                </Form.Label>
                <Col sm={10}>
                    <Form.Control
                        type="text"
                        placeholder="Enter author's name"
                        value={author}
                        onChange={({ target }) => setAuthor(target.value)}
                    />
                </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-4" controlId="formUrl">
                <Form.Label column sm={2}>
                    URL
                </Form.Label>
                <Col sm={10}>
                    <Form.Control
                        type="text"
                        placeholder="Enter blog URL"
                        value={url}
                        onChange={({ target }) => setUrl(target.value)}
                    />
                </Col>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
                <Button variant="success" type="submit">
                    Create
                </Button>
                <Button variant="secondary" onClick={onCancel}>
                    Cancel
                </Button>
            </div>
        </Form>
    )
}
export default BlogForm
