import{useState} from 'react'
import '../App.css'
import blogService from '../services/blogs'


const Blog = ({ blog }) => {
  const [showDetails, setShowDetails] = useState(false)
  const [likes, setLikes] = useState(blog.likes)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    borderWidth: 1,
    marginBottom: 5
  }
  const handleLike=async()=>{
  try{
    const updatedBlog={
      title:blog.title,
      author:blog.author,
      url:blog.url,
      likes:blog.likes+1,
      user:blog.user
      
    }
    const returnedBlog=await blogService.update(blog.id,updatedBlog)
    setLikes(returnedBlog.likes)

  }catch(error){
    console.error('Error liking the blog:', error)
  }
}

  return(
      <div style={blogStyle}>
        <div>
            {blog.title} 
             <button className='button' onClick={()=>setShowDetails(!showDetails)}>
              {showDetails?'Hide':'View'}
             </button>
        </div>
          
      {showDetails && (
        <div>
        <p>{blog.url}</p>
        <div>
          <p style={{ display: 'inline', marginRight: '10px' }}>
          likes {likes}
          </p>
          <button className='button' onClick={handleLike}>like</button>
        </div>
        <p>{blog.author}</p>
        </div>
      )} 
      </div>
  )
 
}



export default Blog