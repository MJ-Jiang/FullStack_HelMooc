const blogRouter = require('express').Router()

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
    try{
        const blog = new Blog(request.body)
        const saveBlog=await blog.save()
        response.status(201).json(saveBlog)
    }catch(error){
        response.status(400).json({error:'bad request'})

    }
  

   
})
module.exports = blogRouter



