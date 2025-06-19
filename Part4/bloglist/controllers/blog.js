const blogRouter = require('express').Router()

const { response } = require('../app')
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
    try{
        const blogs=await Blog.find({})
        response.json(blogs)
    }catch (error){
        response.status(500).json({error:'somthing went wrong'})

    }

   
})
blogRouter.post('/', async(request, response) => {
    const body=request.body
    if (!body.title||!body.url){
        return response.status(400).json({ error: 'title or url missing' })
    }
    try{
        const blog = new Blog({
            title:body.title,
            author:body.author,
            url:body.url,
            likes:body.likes||0

        })
        const saveBlog=await blog.save()
        response.status(201).json(saveBlog)
    }catch(error){
        response.status(400).json({error:'bad request'})

    }
  

   
})
blogRouter.delete('/:id', async (request, response) => {
    const id = request.params.id
     console.log('Received delete request with id:', id, typeof id)

    try {
        const deletedBlog = await Blog.findByIdAndDelete(id)
        if (deletedBlog) {
            return response.status(204).end()
        } else {
            return response.status(404).json({ error: 'blog not found' })
        }
    } catch (error) {
        console.error('Delete error:', error)
        response.status(400).json({ error: 'malformatted id' })
    }
})
blogRouter.put('/:id',async(request,response)=>{
    const id=request.params.id
    console.log('Received update request with id:', id, typeof id)
    const {likes}=request.body
    if (likes===undefined){
        return response.status(400).json({error:'likes missing from request body'})
    }
    try{
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

    }catch(error){
        console.error('update error:', error)
        response.status(400).json({error:'malformatted id or invalid data'})
    }
})
module.exports = blogRouter



