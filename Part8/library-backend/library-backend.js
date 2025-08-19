const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { GraphQLError } = require('graphql')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const Author= require('./models/author')
const Book= require('./models/book')
const User= require('./models/user')
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
    favouriteGenre: String! 
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
      favouriteGenre: String!
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
    me:(_root,_args,{currentUser})=>currentUser,

  },
  Author:{
    bookCount:async(root)=> Book.countDocuments({ author: root._id })
    //root (aka parent) is the object for the type you’re currently resolving.
//Because this is the Author.bookCount resolver, root is the current Author document (from Mongo/Mongoose) whose bookCount we’re computing.
  },
  Mutation:{
    addBook:async(_root,args,{currentUser})=>{
      if(!currentUser){
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
          }
        })
      }
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
      editAuthor:async(_root,args,{currentUser})=>{
        if(!currentUser){
          throw new GraphQLError('Not authenticated', {
            extensions: {
              code: 'UNAUTHENTICATED',
            }
          })
        }
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
    createUser: async (_root, args) => {
      try{
          const user = new User({ username: args.username,favouriteGenre:args.favouriteGenre })
          return await user.save()
      }catch(error)  {
        throw new GraphQLError('Creating the user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error
          }
        })
      }
    },
  
  login: async (_root, args) => {
    const user = await User.findOne({ username: args.username })

    if ( !user || args.password !== 'secret' ) {
      throw new GraphQLError('wrong credentials', {
        extensions: {
          code: 'BAD_USER_INPUT'
        }
      })        
    }

    const userForToken = {
      username: user.username,
      id: user._id,
    }

    return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
  },
  },

}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
   context: async ({ req}) => {
    const auth = req?.headers?.authorization ?? ''
    if (auth.toLowerCase().startsWith('bearer ')) {
      try{const decodedToken = jwt.verify(
            auth.substring(7), process.env.JWT_SECRET
            )
        const currentUser = await User
        .findById(decodedToken.id)
        return { currentUser }

        }catch{
          return {currentUser: null}

        }
     
    }
    return { currentUser: null}
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})