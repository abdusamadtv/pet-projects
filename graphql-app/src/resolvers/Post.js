const Post = {
  author({ author: id }, _args, { db }) {
    return db.users.find(user => user.id === id)
  },
  comments({ id }, _args, { db }) {
    return db.comments.filter(comment => comment.post === id)
  }
}

export default Post
