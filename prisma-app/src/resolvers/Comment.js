const Comment = {
  author({ id }, _, { prisma }) {
    return prisma.comment({ id }).author()
  },
  post({ id }, _, { prisma }) {
    return prisma.comment({ id }).post()
  }
}

export default Comment
