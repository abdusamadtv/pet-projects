const Mutation = {
  createUser(_parent, { data }, { db }) {
    const emailTaken = db.users.some(user => user.email === data.email)

    if (emailTaken) {
      throw new Error('Email taken')
    }

    const user = {
      id: '23',
      ...data
    }

    db.users.push(user)

    return user
  },
  updateUser(_parent, { id, data }, { db }) {
    const user = db.users.find(user => user.id === id)
    user.name = data.name
    user.email = data.email
    user.age = data.age

    return user
  },
  deleteUser(_parent, { id }, { db }) {
    const userIndex = db.users.findIndex(user => user.id === id)

    if (userIndex === -1) {
      throw new Error('User not found')
    }

    const deletedUsers = db.users.splice(userIndex, 1)

    db.posts = db.posts.filter(post => {
      const match = post.author === id

      if (match) {
        db.comments = db.comments.filter(comment => comment.post === post.id)
      }

      return !match
    })
    db.comments = db.comments.filter(comment => comment.author !== id)

    return deletedUsers[0]
  },
  createPost(_parent, { data }, { db, pubsub }) {
    const userExists = db.users.some(user => user.id === data.author)

    if (!userExists) {
      throw new Error('User not found')
    }

    const post = { id: 4, ...data }

    db.posts.push(post)
    data.published &&
      pubsub.publish('post', {
        post: {
          mutation: 'CREATED',
          data: post
        }
      })

    return post
  },
  updatePost(_parent, { id, data }, { db }) {
    const post = db.posts.find(post => post.id === id)

    post.title = data.title
    post.body = data.body
    post.published = data.published

    return post
  },
  deletePost(_parent, { id }, { db, pubsub }) {
    const postIndex = db.posts.findIndex(post => post.id === id)
    const [post] = db.posts.splice(postIndex, 1)

    db.comments = db.comments.filter(comment => comment.post !== id)

    post.published &&
      pubsub.publish('post', {
        post: {
          mutation: 'DELETED',
          data: post
        }
      })

    return post
  },
  createComment(_parent, { data }, { db, pubsub }) {
    const comment = { id: 25, ...data }

    db.comments.push(comment)
    pubsub.publish(`comment ${data.post}`, {
      comment: {
        mutation: 'CREATED',
        data: comment
      }
    })

    return comment
  },
  updateComment(_parent, { id, data }, { db, pubsub }) {
    const comment = db.comments.find(comment => comment.id === id)

    comment.text = data.text
    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: 'UPDATED',
        data: comment
      }
    })

    return comment
  },
  deleteComment(_parent, { id }, { db, pubsub }) {
    const commentIndex = db.comments.findIndex(comment => comment.id === id)
    const [comment] = db.comments.splice(commentIndex, 1)

    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: 'DELETED',
        data: comment
      }
    })

    return comment
  }
}

export default Mutation
