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
module.exports = blogRouter



