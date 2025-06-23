const { test, describe,after,beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const Blog = require('../models/blog')


const api = supertest(app)
describe('when there is initially some blogs saved',()=>{
    const initialBlogs=[
        {"title":"blog1","author":"A","likes":5},
         {"title":"blog2","author":"A","likes":6},
          {"title":"blog3","author":"B","likes":1},
           {"title":"blog4","author":"C","likes":3}
    ]
    beforeEach(async()=>{
        await Blog.deleteMany({})
        await Blog.insertMany(initialBlogs)
    })
    test('blogs are returned as json', async () => {
        await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })
    test ('correct number of blogs returned',async()=>{
        const response=await api.get('/api/blogs')
        assert.strictEqual(response.body.length, initialBlogs.length)

    })
    test('unique identifier property of the blog posts is named id',async()=>{
    const response=await api.get('/api/blogs')
    response.body.forEach( blog=> {
         assert.ok(blog.id, 'Expected blog to have id property')
    });
})
})



describe('when new blogs are saved',()=>{
    test('create a new blog',async()=>{
    const newBlog={
        "title":"blogx",
        "author":"D",
        "url":"www.google.com",
        "likes":5
    }
    const blogsAtStart=await Blog.find({})

    await api.post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
    const blogsAtEnd= await Blog.find({})
    
    assert.strictEqual(blogsAtEnd.length,blogsAtStart.length+1)
    const titles=blogsAtEnd.map(b=>b.title)
    assert(titles.includes('blogx'))
    
})
test('blog without likes',async()=>{
    const newBlog={
           "title":"blogm",
        "author":"D",
        "url":"www.google.com",
        
    }
    const response = await api.post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
    assert.strictEqual(response.body.likes,0)
})
test('blog without title returns 400',async()=>{
    const newBlog={
        author: 'noTitle',
        url: 'http://example.com',
        likes: 2
    }
    await api.post('/api/blogs')
    .send(newBlog)
    .expect(400)
})
test('blog without url returns 400',async()=>{
    const newBlog={
        title: 'noUrL',
        author: 'noUrl',
        likes: 2
    }
    await api.post('/api/blogs')
    .send(newBlog)
    .expect(400)
})
})




describe('when delete a blog',()=>{
    test('delete a blog',async()=>{
    const blogsAtStart=await Blog.find({})
    const blogToDelete=blogsAtStart[0].toJSON()
    console.log('Deleting blog with id:', blogToDelete.id)

    await api.delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)
    const blogsAtEnd=await Blog.find({})
    assert.strictEqual(blogsAtEnd.length,blogsAtStart.length-1)
    const blogsAtEndJSON=blogsAtEnd.map(blog=>blog.toJSON())
    const ids=blogsAtEndJSON.map(blog=>blog.id)
    assert(!ids.includes(blogToDelete.id))
    })
})

test('update the number of likes for a blog',async()=>{
    const blogsAtStart=await Blog.find({})
    const blogToUpdate=blogsAtStart[0].toJSON()
    console.log('Update blog with id:', blogToUpdate.id)
    const upDatedData={likes:blogToUpdate.likes+1}
    const response=await api.put(`/api/blogs/${blogToUpdate.id}`)
        .send(upDatedData)
        .expect(200)
        .expect('Content-Type', /application\/json/)
        assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)
   
})




after(async () => {
  await mongoose.connection.close()
})