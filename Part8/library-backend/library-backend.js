const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { GraphQLError } = require('graphql')
const mongoose = require('mongoose')
require('dotenv').config()

const Author= require('./models/author')
const Book= require('./models/book')

mongoose.set('strictQuery', false)
const MONGODB_URI = process.env.MONGODB_URI
console.log('connecting to', MONGODB_URI)
mongoose.connect(MONGODB_URI)
  .then(() => { console.log('connected to MongoDB') })
  .catch((error) => { console.log('error connecting to MongoDB:', error.message) })

function throwBadUserInputError(error, invalidArgs) {
  if(error?.name==='ValidationError'){
    const details=Object.values(error.errors).map(e=>({
      field:e.path,//// which field failed (e.g. "name", "title")
      message:e.message,// human message
    }))
    throw new GraphQLError('Validation error', {
      extensions: {
        code: 'BAD_USER_INPUT',
        invalidArgs,
        details,
      },
    })
  }
  if(error?.name==='MongoServerError' && error.code===11000){
    throw new GraphQLError('Duplicate key error', {
      extensions: { 
        code: 'BAD_USER_INPUT',
        invalidArgs,
        details: error.keyValue,
      },
    })
  }
  throw new GraphQLError('Saving book failed', {
    extensions: {
      code: 'BAD_USER_INPUT',
      invalidArgs,
      error: { message: error.message }
    },
  })
}

const typeDefs = `
  type Author{
    name: String!
    id:ID!
    born:Int
    bookCount:Int!
  }
  type Book{
    title: String!
    published: Int!
    author: Author!
    id:ID!
    genres: [String!]!
  }
  type User{
    username: String! 
    id:ID!  
  }
  type Token{
    value: String!
  }

  type Query {
    booksCount: Int!
    authorsCount: Int!
    allBooks(author:String, genre:String):[Book!]! 
    allAuthors:[Author!]!
    me:User
  }
  type Mutation{
    addBook(
      title:String!,
      author:String!,
      published:Int!,
      genres:[String!]!
      ):Book!
    editAuthor(
      name:String!,
      setBornTo:Int!):Author
    createUser(
      username: String!
      ): User
    login(
      username: String!
      password: String!
      ): Token
  }
`
//allBooks(author:String)....author optional argument 
// allAuthors:[Author!]!, inner !:Each element in the array must not be null. outer !:The array itself must not be null.
const resolvers = {
  Query: {
    booksCount: async() => Book.collection.countDocuments(),
    authorsCount: async() => Author.collection.countDocuments(),

    allBooks:async(root,args)=>{
      const filter={}

      if(args.author){  
        const found = await Author.findOne({name:args.author}) // //  a Mongoose document, an object with fields like name, _id, born)
        if(!found) return[]
        filter.author = found._id //found._id is the ObjectId of that Author in Mongo.
      }

      if(args.genre){
        filter.genres = { $in: [args.genre] }
      } 
      return Book.find(filter).populate('author')
    },
    allAuthors:async()=>Author.find({}),

  },
  Author:{
    bookCount:async(root)=> Book.countDocuments({ author: root._id })
    //root (aka parent) is the object for the type you’re currently resolving.
//Because this is the Author.bookCount resolver, root is the current Author document (from Mongo/Mongoose) whose bookCount we’re computing.
  },
  Mutation:{
    addBook:async(root,args)=>{
      try{
          let author=await Author.findOne({name:args.author})
          if(!author){
              author=await new Author({name:args.author,born:null}).save()
    
          }
      
          const book=await new Book({
            title:args.title,
            author:author._id,
            published:args.published,
            genres:args.genres,
          }).save()
          return book.populate('author')
      }catch(error){
        console.error('addBook error:', error)
        throwBadUserInputError(error,args)
      }
      
    },
      editAuthor:async(root,args)=>{
        const author = await Author.findOne({ name: args.name })
        if(!author) {
          throw new GraphQLError('Author not found', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name,
            }
          })
        }
        author.born=args.setBornTo
        try{
          await author.save()
        }catch(error){
          throw new GraphQLError('Saving born year failed',{
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name,
              error
            }
          })
        }
        return author
  },
  },

}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})