const Comment = {
  author({ author: id }, _args, { db }) {
    return db.users.find(user => user.id === id)
  },
  post({ post: id }, _args, { db }) {
    return db.posts.find(post => post.id === id)
  }
}

export default Comment
