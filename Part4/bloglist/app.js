// app.js
require('express-async-errors')
const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const usersRouter=require('./controllers/users')
const loginRouter=require('./controllers/login')
const middleware = require('./utils/middleware')
const app = express()

mongoose.connect(config.MONGODB_URI)

app.use(express.json())
app.use(middleware.tokenExtractor)

app.use((request, response, next) => {
    console.log(`${request.method} ${request.path}`)
    next()
    
})
app.use('/api/blogs', middleware.userExtractor,blogsRouter)
app.use('/api/users',usersRouter)
app.use('/api/login',loginRouter)
app.use(middleware.errorHandler)




module.exports = app
