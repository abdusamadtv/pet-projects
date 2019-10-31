const Subscription = {
  post: {
    subscribe: (_parent, _args, { pubsub }) => pubsub.asyncIterator('post')
  },
  comment: {
    subscribe: (_parent, { postId }, { pubsub }) => pubsub.asyncIterator(`comment ${postId}`)
  }
}

export default Subscription
