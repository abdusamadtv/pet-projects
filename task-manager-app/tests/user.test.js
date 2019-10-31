const app = require('../src/app')
const User = require('../src/models/user')
const request = require('supertest')
const { userOne, userOneId, userOneAuthHeader, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should signup a new user', async () => {
  const userData = {
    name: 'Abdusamad',
    email: 'test@test.test',
    password: 'MyPass123'
  }
  const response = await request(app)
    .post('/users')
    .send(userData)
    .expect(201)

  // Assert that the database was changed correctly
  const user = await User.findById(response.body.user._id)
  expect(user).not.toBeNull()

  // Assertions about the response
  expect(response.body).toMatchObject({
    user: {
      name: userData.name,
      email: userData.email
    },
    token: user.tokens[0].token
  })

  // Assert that the password is hashed
  expect(user.password).not.toBe(userData.password)
})

test('Should not signup a new user with invalid name', async () => {
  // Invalid length
  await request(app)
    .post('/users')
    .send({
      name: 'a',
      email: 'email@inbox.domain',
      password: 'abcdefg123'
    })
    .expect(400)
})

test('Should not signup a new user with invalid email', async () => {
  // Invalid value
  await request(app)
    .post('/users')
    .send({
      name: 'ab',
      email: 'wrongEmail',
      password: 'abcdefg123'
    })
    .expect(400)
})

test('Should not signup a new user with invalid password', async () => {
  // Invalid value
  await request(app)
    .post('/users')
    .send({
      name: 'ab',
      email: 'email@inbox.domain',
      password: 'password'
    })
    .expect(400)

  // Invalid length
  await request(app)
    .post('/users')
    .send({
      name: 'ab',
      email: 'email@inbox.domain',
      password: '123456'
    })
    .expect(400)
})

test('Should login existing user', async () => {
  const response = await request(app)
    .post('/users/login')
    .send({
      email: userOne.email,
      password: userOne.password
    })
    .expect(200)

  const user = await User.findById(userOneId)
  expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login nonexistent user', async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: userOne.email,
      password: 'wrongpassword'
    })
    .expect(400)
})

test('Should get profile for user', async () => {
  await request(app)
    .get('/users/me')
    .set(...userOneAuthHeader)
    .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
  await request(app)
    .get('/users/me')
    .expect(401)
})

test('Should delete account for user', async () => {
  await request(app)
    .delete('/users/me')
    .set(...userOneAuthHeader)
    .expect(200)

  const user = await User.findById(userOneId)
  expect(user).toBeNull()
})

test('Should not delete account for unauthenticated user', async () => {
  await request(app)
    .delete('/users/me')
    .expect(401)
})

test('Should upload avatar image', async () => {
  await request(app)
    .post('/users/me/avatar')
    .set(...userOneAuthHeader)
    .attach('avatar', 'tests/fixtures/avatar.jpg')
    .expect(200)

  const user = await User.findById(userOneId)
  expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should not update user if unauthenticated', async () => {
  await request(app)
    .patch('/users/me')
    .send({ name: 'newName' })
    .expect(401)
})

test('Should not update user with invalid name', async () => {
  // Invalid length
  await request(app)
    .patch('/users/me')
    .set(...userOneAuthHeader)
    .send({ name: 'a' })
    .expect(400)
})

test('Should not update user with invalid email', async () => {
  // Invalid value
  await request(app)
    .patch('/users/me')
    .set(...userOneAuthHeader)
    .send({ email: 'wrongEmail' })
    .expect(400)
})

test('Should not update user with invalid password', async () => {
  // Invalid value
  await request(app)
    .patch('/users/me')
    .set(...userOneAuthHeader)
    .send({ password: 'password' })
    .expect(400)

  // Invalid length
  await request(app)
    .patch('/users/me')
    .set(...userOneAuthHeader)
    .send({ password: '123456' })
    .expect(400)
})

test('Should update valid user fields', async () => {
  const newName = 'NewName'
  await request(app)
    .patch('/users/me')
    .set(...userOneAuthHeader)
    .send({ name: newName })
    .expect(200)

  const user = await User.findById(userOneId)
  expect(user.name).toBe(newName)
})

test('Should not update invalid user fields', async () => {
  await request(app)
    .patch('/users/me')
    .set(...userOneAuthHeader)
    .send({
      invalidField: 'value'
    })
    .expect(400)
})

test('Should not delete user if unauthenticated', async () => {
  await request(app)
    .delete('/users/me')
    .expect(401)
})
