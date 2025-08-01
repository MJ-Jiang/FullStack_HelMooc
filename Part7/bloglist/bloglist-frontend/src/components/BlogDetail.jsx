import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { likeBlog, addComment } from '../reducers/blogReducer'
import { useState } from 'react'
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
        <div style={{ padding: 10, marginTop: 10 }}>
            <h2>
                {blog.title} {blog.author}
            </h2>
            <p>
                <a href={blog.url} target="_blank" rel="noopener noreferrer">
                    {blog.url}
                </a>
            </p>
            <p>
                {blog.likes} likes <button onClick={handleLike}>like</button>
            </p>
            <p>added by {blog.user.username}</p>
            <h3>Comments</h3>
            <form onSubmit={handleComment}>
                <input
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Leave a comment... "
                />
                <button type="submit">add comment</button>
            </form>
            <ul>
                {blog.comments.map((c, index) => (
                    <li key={index}>{c}</li>
                ))}
            </ul>
        </div>
    )
}
export default BlogDetail
