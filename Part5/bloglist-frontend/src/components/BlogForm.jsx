import { useState } from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'
const BlogForm=({ setBlogs,blogs,setMessage }) => {
  const[title,setTitle]=useState('')
  const[author,setAuthor]=useState('')
  const[url,setUrl]=useState('')

  const handleNewBlog=async(event) => {
    event.preventDefault()
    try{
      const newBlog={ title,author,url }
      const returnedBlog=await blogService.create(newBlog)
      setBlogs(blogs.concat(returnedBlog))
      setTitle('')
      setAuthor('')
      setUrl('')
      setMessage({ text:`A new blog "${title}" by ${author} added`,type:'success' })
      setTimeout(() => {setMessage(null)},5000)
    }catch(error){
      console.error('error creating blog:',error)
    }
  }
  return (
    <div>
      <h3>Create new</h3>
      <form onSubmit={handleNewBlog}>
                title:
        <input
          type='text'
          value={title}
          name='title'
          onChange={({ target }) => setTitle(target.value)}
        />
        <br/>
                author:
        <input
          type='text'
          value={author}
          name='author'
          onChange={({ target }) => setAuthor(target.value)}
        />
        <br/>
                url:
        <input
          type='text'
          value={url}
          name='url'
          onChange={({ target }) => setUrl(target.value)}
        />

        <br/>
        <button type="submit" className="button">Create</button>
      </form>
    </div>
  )

}
BlogForm.propTypes={
  setBlogs:PropTypes.func.isRequired,
  blogs:PropTypes.array.isRequired,
  setMessage:PropTypes.func.isRequired
}


export default BlogForm