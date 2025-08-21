import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { makeExecutableSchema } from '@graphql-tools/schema'
import express from 'express'
import cors from 'cors'
import http from 'http'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/use/ws'

import typeDefs from './schema.js'
import resolvers from './resolvers.js'
import User from './models/user.js'

import dotenv from 'dotenv'
dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI
console.log('connecting to', MONGODB_URI)
mongoose.connect(MONGODB_URI)
  .then(() => { console.log('connected to MongoDB') })
  .catch((error) => { console.log('error connecting to MongoDB:', error.message) })
const start=async () => {
  const app = express() 
  const httpServer = http.createServer(app)
  const wsServer = new WebSocketServer({
    server: httpServer, 
    path:'/',
  })
 const schema=makeExecutableSchema({
    typeDefs, 
    resolvers,
  })
  const serverCleanup = useServer({ schema }, wsServer)
  // The `useServer` function sets up the WebSocket server to handle GraphQL subscriptions 

  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose()
          }
        }
      }   
    }
  ],
  })
  await server.start()
  app.use('/',cors(),express.json(), expressMiddleware(server, {
    context: async ({ req }) => {
      const auth = req?.headers?.authorization ?? ''  
      if (auth.toLowerCase().startsWith('bearer ')) {
        try { 
          const decodedToken = jwt.verify(
            auth.substring(7), process.env.JWT_SECRET
          )
          const currentUser = await User
            .findById(decodedToken.id)
          return { currentUser }
        } catch {
          return { currentUser: null }  
        }
      }
      return { currentUser: null }
    }
  }))
  const PORT = process.env.PORT || 4000
  httpServer.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}`)
  })
}
start()
