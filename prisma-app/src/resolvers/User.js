const User = {
  posts({ id }, _args, { prisma }) {
    return prisma.user({ id }).posts()
  },
  comments({ id }, _args, { prisma }) {
    return prisma.user({ id }).comments()
  }
}

export default User
