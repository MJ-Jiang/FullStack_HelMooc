import * as GQLSubs from "graphql-subscriptions"
console.log("graphql-subscriptions exports:", GQLSubs)
import { GraphQLError } from "graphql"
import jwt from "jsonwebtoken"
import  throwBadUserInputError  from "./models/utils.js"
import Author from "./models/author.js"
import Book from "./models/book.js"
import User from "./models/user.js"
import { PubSub } from "graphql-subscriptions"

const pubsub = new PubSub()

console.log(pubsub.asyncIterator)
console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(pubsub)))
const resolvers = {
  Query: {
    booksCount: async () => Book.collection.countDocuments(),
    authorsCount: async () => Author.collection.countDocuments(),

    allBooks: async (root, args) => {
      const filter = {}

      if (args.author) {
        const found = await Author.findOne({ name: args.author }) // //  a Mongoose document, an object with fields like name, _id, born)
        if (!found) return []
        filter.author = found._id //found._id is the ObjectId of that Author in Mongo.
      }

      if (args.genre) {
        filter.genres = { $in: [args.genre] }
      }
      return Book.find(filter).populate('author')
    },
    allAuthors: async () => Author.find({}),
    me: (_root, _args, { currentUser }) => currentUser,
  },
  Author: {
    bookCount: async (root) => Book.countDocuments({ author: root._id })
    //root (aka parent) is the object for the type you’re currently resolving.
    //Because this is the Author.bookCount resolver, root is the current Author document (from Mongo/Mongoose) whose bookCount we’re computing.
  },
  Mutation: {
    addBook: async (_root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
          }
        })
      }
      try {
        let author = await Author.findOne({ name: args.author })
        if (!author) {
          author = await new Author({ name: args.author, born: null }).save()

        }

        const book = await new Book({
          title: args.title,
          author: author._id,
          published: args.published,
          genres: args.genres,
        }).save()
        const saveBook=await book.populate('author')
        pubsub.publish('BOOK_ADDED', { bookAdded: saveBook })
        return saveBook
      } catch (error) {
        console.error('addBook error:', error)
        throwBadUserInputError(error, args)
      }
     
    },
    editAuthor: async (_root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
          }
        })
      }
      const author = await Author.findOne({ name: args.name })
      if (!author) {
        throw new GraphQLError('Author not found', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
          }
        })
      }
      author.born = args.setBornTo
      try {
        await author.save()
      } catch (error) {
        throw new GraphQLError('Saving born year failed', {
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
      try {
        const user = new User({ username: args.username, favouriteGenre: args.favouriteGenre })
        return await user.save()
      } catch (error) {
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

      if (!user || args.password !== 'secret') {
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
    Subscription: {
        bookAdded: {
        subscribe: () => pubsub.asyncIterableIterator(['BOOK_ADDED']),
  },
},

}
export default resolvers