const Subscription = {
  posts: {
    resolve: payload => payload,
    subscribe: (_parent, _args, { prisma }) =>
      prisma.$subscribe.post({
        node: {
          isPublished: true
        }
      })
  },
  comments: {
    resolve: payload => payload,
    subscribe: (_parent, { postId }, { prisma }) =>
      prisma.$subscribe.comment({
        node: {
          post: { id: postId }
        }
      })
  }
}

export default Subscription
