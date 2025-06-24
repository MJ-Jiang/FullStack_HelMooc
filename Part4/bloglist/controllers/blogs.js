const blogRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const { response } = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')//new
// const getTokenFrom = request => {
//   const authorization = request.get('authorization')
//   if (authorization && authorization.startsWith('Bearer ')) {
//     return authorization.replace('Bearer ', '')
//   }
//   return null
// } //new
blogRouter.get('/', async (request, response) => {
        const blogs=await Blog.find({}).populate('userId', { username: 1, name: 1 ,id:1})
        response.json(blogs)

})
blogRouter.post('/', async(request, response) => {
    const {title,author,url,likes,userId}=request.body
    // const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    // if (!decodedToken.id) {
    //     return response.status(401).json({ error: 'token invalid' })
    // }
    //const user = await User.findById(decodedToken.id)//new
    const user=await User.findById(userId) 
    if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
    }//new
    if (!title||!url){
        return response.status(400).json({ error: 'title or url missing' })
    }
    
        const blog = new Blog({
            title,
            author,
            url,
            likes:likes||0,
            userId: user._id  //new

        })
        const saveBlog=await blog.save()
        user.blogs=user.blogs.concat(saveBlog._id) 
        await user.save() 
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



