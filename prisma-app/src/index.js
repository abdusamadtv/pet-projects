import { prisma } from '../src/generated/prisma-client'
import { resolvers } from './resolvers'
import { permissions } from './permissions'
import { GraphQLServer } from 'graphql-yoga'

const server = new GraphQLServer({
  context: request => ({ ...request, prisma }),
  typeDefs: './src/schema.graphql',
  resolvers,
  middlewares: [permissions]
})

server.start(() => {
  console.log('Server up!')
})
