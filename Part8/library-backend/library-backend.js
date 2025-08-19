const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
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

// let authors = [
//   {
//     name: 'Robert Martin',
//     id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
//     born: 1952,
//   },
//   {
//     name: 'Martin Fowler',
//     id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
//     born: 1963
//   },
//   {
//     name: 'Fyodor Dostoevsky',
//     id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
//     born: 1821
//   },
//   { 
//     name: 'Joshua Kerievsky', // birthyear not known
//     id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
//   },
//   { 
//     name: 'Sandi Metz', // birthyear not known
//     id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
//   },
// ]


// let books = [
//   {
//     title: 'Clean Code',
//     published: 2008,
//     author: 'Robert Martin',
//     id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring']
//   },
//   {
//     title: 'Agile software development',
//     published: 2002,
//     author: 'Robert Martin',
//     id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
//     genres: ['agile', 'patterns', 'design']
//   },
//   {
//     title: 'Refactoring, edition 2',
//     published: 2018,
//     author: 'Martin Fowler',
//     id: "afa5de00-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring']
//   },
//   {
//     title: 'Refactoring to patterns',
//     published: 2008,
//     author: 'Joshua Kerievsky',
//     id: "afa5de01-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring', 'patterns']
//   },  
//   {
//     title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
//     published: 2012,
//     author: 'Sandi Metz',
//     id: "afa5de02-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring', 'design']
//   },
//   {
//     title: 'Crime and punishment',
//     published: 1866,
//     author: 'Fyodor Dostoevsky',
//     id: "afa5de03-344d-11e9-a414-719c6709cf3e",
//     genres: ['classic', 'crime']
//   },
//   {
//     title: 'Demons',
//     published: 1872,
//     author: 'Fyodor Dostoevsky',
//     id: "afa5de04-344d-11e9-a414-719c6709cf3e",
//     genres: ['classic', 'revolution']
//   },
// ]


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
  type Query {
    booksCount: Int!
    authorsCount: Int!
    allBooks(author:String, genre:String):[Book!]! 
    allAuthors:[Author!]!
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
    },
      editAuthor:async(root,args)=>{
        return Author.findOneAndUpdate(
          { name: args.name },
          { born: args.setBornTo },
          { new: true }
        ) 
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