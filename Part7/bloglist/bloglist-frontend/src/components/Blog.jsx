import {Link} from 'react-router-dom'
const Blog=({blog})=>{
    const blogStyle={
        padding:8,
        marginBotton:5,
        border:'1px solid black',
        borderRaius:4
    }
    return (
        <div style={blogStyle} className='blog'>
            <Link to={`/blogs/${blog.id}`} style={{textDecoration:'none',color:'black'}}>
            {blog.title}{blog.author}
            </Link>
        </div>
    )
}
export default Blog