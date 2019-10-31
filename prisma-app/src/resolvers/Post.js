const Post = {
  author({ id }, _, { prisma }) {
    return prisma.post({ id }).author()
  },
  comments({ id }, _, { prisma }) {
    return prisma.post({ id }).comments()
  }
}

export default Post
