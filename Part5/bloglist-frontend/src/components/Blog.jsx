import{useState} from 'react'
import '../App.css'


const Blog = ({ blog }) => {
  const [showDetails, setShowDetails] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    borderWidth: 1,
    marginBottom: 5
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
          likes {blog.likes}
          </p>
          <button className='button'>like</button>
        </div>
        <p>{blog.author}</p>
        </div>
      )} 
      </div>
  )
 
}



export default Blog