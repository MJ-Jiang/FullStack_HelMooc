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
before(async()=>{
    await User.deleteMany({})
    const passwordHash=await bcrypt.hash('sekret',10)
    const newUser=new User({username:'test',name:'SuperuserJune',passwordHash})
    await newUser.save()
    const loginResponse=await api.post('/api/login').send({username:'test',password:'sekret'})
    token=loginResponse.body.token
}

)
beforeEach(async()=>{
    await Blog.deleteMany({})
})
test('login returns a token', async () => {
  const response = await api
    .post('/api/login')
    .send({ username: 'test', password: 'sekret' })
    .expect(200)

  console.log(response.body.token) 
})
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

after(async () => {
  await mongoose.connection.close()
})