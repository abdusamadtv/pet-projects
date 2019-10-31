const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')
const mongoose = require('mongoose')

const userOneId = new mongoose.Types.ObjectId()
const userTwoId = new mongoose.Types.ObjectId()
const userOne = {
  _id: userOneId,
  name: 'Abdusamad',
  email: 'test@test.com',
  password: 'abcdefg123',
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }
  ]
}
const userTwo = {
  _id: userTwoId,
  name: 'John',
  email: 'john@test.com',
  password: 'newpass2019',
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }
  ]
}

const userOneAuthToken = `Bearer ${userOne.tokens[0].token}`
const userTwoAuthToken = `Bearer ${userTwo.tokens[0].token}`

const userOneAuthHeader = ['Authorization', userOneAuthToken]
const userTwoAuthHeader = ['Authorization', userTwoAuthToken]

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: 'First task',
  completed: false,
  owner: userOneId
}
const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Second task',
  completed: true,
  owner: userOneId
}

const setupDatabase = async () => {
  await User.deleteMany()
  await Task.deleteMany()

  await new User(userOne).save()
  await new User(userTwo).save()
  await new Task(taskOne).save()
  await new Task(taskTwo).save()
}

module.exports = {
  taskOne,
  userOne,
  userOneId,
  userOneAuthHeader,
  userTwoAuthHeader,
  setupDatabase
}
