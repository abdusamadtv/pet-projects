import { getUserId } from '../utils'
import { rule, shield } from 'graphql-shield'

const rules = {
  isAuthenticatedUser: rule()((_parent, _args, context) => {
    const userId = getUserId(context)
    return Boolean(userId)
  }),
  isPostOwner: rule()(async (_parent, { id }, context) => {
    const userId = getUserId(context)
    const author = await context.prisma.post({ id }).author()
    return userId === author.id
  })
}

const permissions = shield({
  Query: {
    users: rules.isAuthenticatedUser
  },
  Mutation: {
    deletePost: rules.isPostOwner
    // publish: rules.isPostOwner
    // createDraft: rules.isAuthenticatedUser,
  }
})

export { permissions }
