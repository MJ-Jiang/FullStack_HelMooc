import { Link } from 'react-router-dom'
const Blog = ({ blog }) => {
    return (
        <div className="blog">
            <Link
                to={`/blogs/${blog.id}`}
                style={{ textDecoration: 'none', color: 'black' }}
            >
                {blog.title}
                {blog.author}
            </Link>
        </div>
    )
}
export default Blog
