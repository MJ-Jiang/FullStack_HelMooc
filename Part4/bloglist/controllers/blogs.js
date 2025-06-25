const blogRouter = require('express').Router()

const Blog = require('../models/blog')
const User = require('../models/user')//new
const { tokenExtractor,userExtractor } = require('../utils/middleware')

blogRouter.get('/', async (request, response) => {
        const blogs=await Blog.find({}).populate('userId', { username: 1, name: 1 ,id:1})
        response.json(blogs)

})
blogRouter.post('/',  tokenExtractor,userExtractor, async(request, response) => {
     //console.log('Token from request:', request.token)
    const {title,author,url,likes,userId}=request.body
    const user = request.user
 
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
            userId: user._id  //only contains the ID — not the rest of the user's info

        })
        const saveBlog=await blog.save()
        user.blogs=user.blogs.concat(saveBlog._id) 
        await user.save() 
        response.status(201).json(saveBlog)
   
})
blogRouter.delete('/:id', async (request, response) => {
    // console.log('DELETE /api/blogs/:id called')
    //console.log('Token from request:', request.token)
     //console.log('  ID in params:', request.params.id)
    const user=request.user
    // const token=request.token
    // if(!token){
    //     return response.status(401).json({error:'token missing'})
    // }
    // let decodedToken
    // decodedToken=jwt.verify(token,process.env.SECRET)
    // if(!decodedToken.id){
    //     return response.status(401).json({error:'token invalid'})
    // }
    // //console.log('token decoded id:', decodedToken.id) 
     const blog = await Blog.findById(request.params.id)
     //console.log('blog.userId:', blog.userId.toString())
    if(!blog){
        return response.status(401).json({error:'blog not found'})
    }
    if(blog.userId.toString()!==user.id.toString()){
        return response.status(401).json({error:'unauthorized: only creator can delete the blog'})
    }
   
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()

    
})
//update likes
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



