// app.js
require('express-async-errors')
const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const blogsRouter = require('./controllers/blog')

const app = express()

mongoose.connect(config.MONGODB_URI)

app.use(express.json())
app.use('/api/blogs', blogsRouter)
app.use((error, request, response, next) => {
    console.error(error.message)
    response.status(500).json({ error: 'something went wrong on the server' })
})


module.exports = app
