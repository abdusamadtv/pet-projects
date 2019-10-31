import { sign } from 'jsonwebtoken'
import { APP_SECRET } from '../utils'
import { hash, compare } from 'bcrypt'

const Mutation = {
  signup: async (_, { data: { name, email, password } }, { prisma }) => {
    if (password.length < 6) {
      throw new Error('Password is too weak. Min length is 6')
    }

    const hashedPassword = await hash(password, 10)
    const user = await prisma.createUser({
      name,
      email,
      password: hashedPassword
    })

    return {
      token: sign({ userId: user.id }, APP_SECRET),
      user
    }
  },
  login: async (_, { data: { email, password } }, { prisma }) => {
    const user = await prisma.user({ email })

    if (!user) {
      throw new Error(`No user found for email: ${email}`)
    }

    const passwordValid = await compare(password, user.password)

    if (!passwordValid) {
      throw new Error('Invalid password')
    }

    return {
      token: sign({ userId: user.id }, APP_SECRET),
      user
    }
  },
  updateUser(_, { id, data }, { prisma }) {
    return prisma.updateUser({
      data,
      where: { id }
    })
  },
  deleteUser(_, { id }, { prisma }) {
    return prisma.deleteUser({ id })
  },
  createPost(_, { data }, { prisma }) {
    return prisma.createPost({
      title: data.title,
      body: data.body,
      isPublished: data.isPublished,
      author: {
        connect: { id: data.author }
      }
    })
  },
  updatePost(_, { id, data }, { prisma }) {
    return prisma.updatePost({
      data,
      where: { id }
    })
  },
  deletePost(_, { id }, { prisma }) {
    return prisma.deletePost({ id })
  },
  createComment(_, { data }, { prisma }) {
    return prisma.createComment({
      text: data.text,
      post: {
        connect: { id: data.post }
      },
      author: {
        connect: { id: data.author }
      }
    })
  },
  updateComment(_, { id, data }, { prisma }) {
    return prisma.updateComment({
      data,
      where: { id }
    })
  },
  deleteComment(_, { id }, { prisma }) {
    return prisma.deleteComment({ id })
  }
}

export default Mutation
