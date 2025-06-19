const { test, after,beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const Blog = require('../models/blog')


const api = supertest(app)
const initialBlogs=[
        {"title":"blog1","author":"A","likes":5},
         {"title":"blog2","author":"A","likes":6},
          {"title":"blog3","author":"B","likes":1},
           {"title":"blog4","author":"C","likes":3}
]
beforeEach(async()=>{
    await Blog.deleteMany({})
    for (const blog of initialBlogs){
        const blogObject=new Blog(blog)
        await blogObject.save()
    }
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
         assert.ok(blog.id, 'Expected blog to have id property')
    });
})
after(async () => {
  await mongoose.connection.close()
})