const User = {
  posts({ id }, _args, { db }) {
    return db.posts.filter(post => post.author === id)
  },
  comments({ id }, _args, { db }) {
    return db.comments.filter(comment => comment.author === id)
  }
}

export default User
