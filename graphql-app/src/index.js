import { GraphQLServer, PubSub } from 'graphql-yoga'
import db from './db'
import resolvers from './resolvers'

const pubsub = new PubSub()

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  context: { db, pubsub },
  resolvers
})

server.start(() => {
  console.log('Server up!')
})
