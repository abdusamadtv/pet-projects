const Query = {
  users(_parent, _args, { db }, info) {
    console.log(info)
    return db.users
  },
  posts(_parent, { query }, { db }) {
    if (query) {
      return db.posts.filter(
        post =>
          post.body.toLowerCase().includes(query.toLowerCase()) ||
          post.title.toLowerCase().includes(query.toLowerCase())
      )
    }
    return db.posts
  },
  comments(_parent, _args, { db }) {
    return db.comments
  }
}

export default Query
