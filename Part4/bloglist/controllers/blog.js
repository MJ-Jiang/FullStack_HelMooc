const blogRouter = require('express').Router()

const { response } = require('../app')
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
        const blogs=await Blog.find({})
        response.json(blogs)

})
blogRouter.post('/', async(request, response) => {
    const {title,author,url,likes}=request.body
    if (!title||!url){
        return response.status(400).json({ error: 'title or url missing' })
    }
    
        const blog = new Blog({
            title,
            author,
            url,
            likes:likes||0

        })
        const saveBlog=await blog.save()
        response.status(201).json(saveBlog)
   
})
blogRouter.delete('/:id', async (request, response) => {
    const id = request.params.id
     console.log('Received delete request with id:', id, typeof id)

  
        const deletedBlog = await Blog.findByIdAndDelete(id)
        if (deletedBlog) {
            return response.status(204).end()
        } else {
            return response.status(404).json({ error: 'blog not found' })
        }
    
})
blogRouter.put('/:id',async(request,response)=>{
    const id=request.params.id
    console.log('Received update request with id:', id, typeof id)
    const {likes}=request.body
    if (likes===undefined){
        return response.status(400).json({error:'likes missing from request body'})
    }
    
        const updatedBlog=await Blog.findByIdAndUpdate(
            id,
            {likes},
            {new:true, runValidators:true, context:'query'}
        )
        if (updatedBlog){
            response.json(updatedBlog)
        }else{
            response.status(400).json({error:'blog not found'})
        }

})
module.exports = blogRouter



