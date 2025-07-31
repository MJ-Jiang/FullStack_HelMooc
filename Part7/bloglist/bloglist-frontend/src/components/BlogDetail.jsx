import { useParams } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import {likeBlog} from '../reducers/blogReducer'

const BlogDetail=()=>{
    const {id}=useParams()
    const blog=useSelector(state=>state.blogs.find(b=>b.id===id))
    const dispatch=useDispatch()
    if (!blog || !blog.user) {
        return <p>Loading full blog data...</p>
    }
    const handleLike=()=>{
        dispatch(likeBlog(blog))
    }
    return (
        <div style={{padding: 10, marginTop: 10 }}>
        <h2>{blog.title} {blog.author}</h2>
        <p><a href={blog.url} target="_blank" rel="noopener noreferrer">
            {blog.url}
            </a>
        </p>
        <p>
        {blog.likes} likes{' '}
        <button onClick={handleLike}>like</button>
        </p>
        <p>added by {blog.user.username}</p>
        </div>
    )
}
export default BlogDetail