const { test, describe,after,beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const api = supertest(app)
describe('User creation',()=>{
    test('fails if username is missing',async()=>{
        const newUser={
            name:'Test User',
            password:'validpassword'
        }
        const response=await api.post('/api/users').send(newUser).expect(400).expect('Content-Type', /application\/json/)
        assert(response.body.error.includes('Username and password are required'))
    })
    test('fails if password is too short',async()=>{
        const newUser={
            username:'testuser',
            name:'Test User',
            password:'pw'
        }
        const response=await api.post('/api/users').send(newUser).expect(400)
        assert(response.body.error.includes('at least 3 characters long'))
    })
    test('fails if usernam is too short',async()=>{
        const newUser={
            username:'te',
            name:'Test User',
            password:'pw'
        }
        const response=await api.post('/api/users').send(newUser).expect(400)
        assert(response.body.error.includes('at least 3 characters long'))
    })
})