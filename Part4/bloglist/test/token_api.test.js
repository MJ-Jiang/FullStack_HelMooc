const { test, describe,after,beforeEach,before } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const api=supertest(app)
let token=''
// Only executed once, an initialization operation is performed before the entire test file starts
before(async()=>{
    await User.deleteMany({})
    const passwordHash=await bcrypt.hash('sekret',10)
    const newUser=new User({username:'test',name:'SuperuserJune',passwordHash})
    await newUser.save()

    const loginResponse=await api.post('/api/login').send({username:'test',password:'sekret'})
    token=loginResponse.body.token
}

)
// runs before every individual test
beforeEach(async()=>{
    await Blog.deleteMany({})
})
describe('User login',()=>{
    test('login returns a token', async () => {
        const response = await api
        .post('/api/login')
        .send({ username: 'test', password: 'sekret' })
        .expect(200)

        assert.ok(response.body.token)
    })
})
   
describe('Added new blogs',()=>{
 
    test('a valid blog can be added with a token',async()=>{
        const blogsAtStart=await Blog.find({})
        const newBlog={
            title:'TestBlog',
            author:'Test June',
            url:'http://example.com',
            likes:5,
        }
        await api.post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog).expect(201).expect('Content-Type', /application\/json/)
        const blogsAtEnd=await Blog.find({})
        assert.strictEqual(blogsAtEnd.length, blogsAtStart.length+1)
    })
    test('blog cannot be added without a token',async()=>{
        const newBlog={
            title:"Unauthorized blog",
            author:"tester",
            url:"http://test",
            likes:1
        }
        await api.post('/api/blogs').send(newBlog).expect(401)
    })
})
describe('DELETE /api/blogs/:id',()=>{
    let blogId=''
    beforeEach(async()=>{
        const newBlog={
            title:'Blog to delete',
            author:'Author',
            url:'http://delete.test',
            likes:0,
            
        }
        const blogResponse=await api.post('/api/blogs').set('Authorization', `Bearer ${token}`)
        .send(newBlog).expect(201)
        .expect('Content-Type', /application\/json/)
        //console.log('blogResponse.body:', blogResponse.body)

        blogId=blogResponse.body.id
    })
    test('delete succeeds with 204 ', async () => {
       
        await api.delete(`/api/blogs/${blogId}`)
        .set('Authorization', `Bearer ${token}`).expect(204)
        const blogAfterDelete = await Blog.findById(blogId)
        assert.strictEqual(blogAfterDelete, null)
    })
   test('delete fails with 401 if no token provided', async () => {
    const newBlog = {
      title: 'Another blog',
      author: 'Author',
      url: 'http://another.url',
      likes: 0,
    }
    const blogResponse = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
       blogId=blogResponse.body.id

    await api
      .delete(`/api/blogs/${blogId}`)
      .expect(401)
  })

  test('delete fails with 401 if token is invalid or user is not owner', async () => {
    const otherPasswordHash = await bcrypt.hash('othersekret', 10)
    const otherUser = new User({ username: 'otheruser', name:'SuperuserWho',passwordHash: otherPasswordHash })
    await otherUser.save()

    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'otheruser', password: 'othersekret' })

    const otherUserToken = loginResponse.body.token
    await api
      .delete(`/api/blogs/${blogId}`)
      .set('Authorization', `Bearer ${otherUserToken}`)
      .expect(401)
  })
})


after(async () => {
  await mongoose.connection.close()
})