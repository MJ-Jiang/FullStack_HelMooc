const mongoose = require("mongoose");


const blogSchema = mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number,
    userId: {
    type: mongoose.Schema.Types.ObjectId, //userId must be an ObjectId
    ref: 'User' //reference a document in the 'User' collection
  }
})
blogSchema.set('toJSON',{
    transform:(document,returnedObject)=>{
        returnedObject.id=returnedObject._id.toString()
        delete returnedObject._id
        
    }
})
const Blog = mongoose.model("Blog", blogSchema)
module.exports = Blog
