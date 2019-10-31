const Query = {
  users(_, { query }, { prisma }) {
    const options = {}

    if (query) {
      options.where = {
        OR: [{ name_contains: query }, { email_contains: query }, { age_contains: query }]
      }
    }

    return prisma.users(options)
  },
  posts(_, { query }, { prisma }) {
    const options = {}

    if (query) {
      options.where = {
        OR: [{ title_contains: query }, { body_contains: query }]
      }
    }

    return prisma.posts(options)
  },
  comments(_, { query }, { prisma }) {
    const options = {}

    if (query) {
      options.where = { text_contains: query }
    }

    return prisma.comments(options)
  }
}

export default Query
