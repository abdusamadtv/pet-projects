const app = require('../src/app')
const Task = require('../src/models/task')
const request = require('supertest')
const { userOneAuthHeader, userTwoAuthHeader, taskOne, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create task for userOne', async () => {
  const response = await request(app)
    .post('/tasks')
    .set(...userOneAuthHeader)
    .send({
      description: 'From tests'
    })
    .expect(201)

  const task = await Task.findById(response.body._id)
  expect(task).not.toBeNull()
  expect(task.completed).toBe(false)
})

test('Should not create task with invalid description', async () => {
  await request(app)
    .post('/tasks')
    .set(...userOneAuthHeader)
    .send({
      description: ''
    })
    .expect(400)
})

test('Should not create task with invalid completed', async () => {
  await request(app)
    .post('/tasks')
    .set(...userOneAuthHeader)
    .send({
      completed: 'string'
    })
    .expect(400)
})

test('Should not update task with invalid description', async () => {
  await request(app)
    .patch(`/tasks/${taskOne._id}`)
    .set(...userOneAuthHeader)
    .send({
      description: ''
    })
    .expect(400)
})

test('Should not update task with invalid completed', async () => {
  await request(app)
    .patch(`/tasks/${taskOne._id}`)
    .set(...userOneAuthHeader)
    .send({
      completed: 'string'
    })
    .expect(400)
})

test(`Should fail for userTwo to update taskOne of userOne`, async () => {
  await request(app)
    .patch(`/tasks/${taskOne._id}`)
    .set(...userTwoAuthHeader)
    .expect(404)
})

test('Should fetch only completed tasks', async () => {
  const response = await request(app)
    .get('/tasks')
    .query({ completed: true })
    .set(...userOneAuthHeader)
    .expect(200)

  const completedTasksOnly = response.body.every(task => task.completed)
  expect(completedTasksOnly).toBe(true)
})

test('Should fetch only incomplete tasks', async () => {
  const response = await request(app)
    .get('/tasks')
    .query({ completed: false })
    .set(...userOneAuthHeader)
    .expect(200)

  const incompletedTasksOnly = response.body.every(task => !task.completed)
  expect(incompletedTasksOnly).toBe(true)
})

test('Should limit tasks', async () => {
  const response = await request(app)
    .get('/tasks')
    .query({ limit: 1 })
    .set(...userOneAuthHeader)
    .expect(200)

  expect(response.body.length).toBe(1)
})

test('Should skip 1 task', async () => {
  const response = await request(app)
    .get('/tasks')
    .query({ skip: 1 })
    .set(...userOneAuthHeader)
    .expect(200)

  expect(response.body[0].description).toBe('Second task')
})

test('Should sort tasks by description', async () => {
  const ascOrderResponse = await request(app)
    .get('/tasks')
    .query({ sortBy: 'description:asc' })
    .set(...userOneAuthHeader)
    .expect(200)

  expect(ascOrderResponse.body[0].description).toBe('First task')

  const descOrderResponse = await request(app)
    .get('/tasks')
    .query({ sortBy: 'description:desc' })
    .set(...userOneAuthHeader)
    .expect(200)

  expect(descOrderResponse.body[0].description).toBe('Second task')
})

test('Should sort tasks by completed', async () => {
  const ascOrderResponse = await request(app)
    .get('/tasks')
    .query({ sortBy: 'completed:asc' })
    .set(...userOneAuthHeader)
    .expect(200)

  expect(ascOrderResponse.body[0].completed).toBe(false)

  const descOrderResponse = await request(app)
    .get('/tasks')
    .query({ sortBy: 'completed:desc' })
    .set(...userOneAuthHeader)
    .expect(200)

  expect(descOrderResponse.body[0].completed).toBe(true)
})

test('Should sort tasks by createdAt', async () => {
  const ascOrderResponse = await request(app)
    .get('/tasks')
    .query({ sortBy: 'createdAt:asc' })
    .set(...userOneAuthHeader)
    .expect(200)

  expect(ascOrderResponse.body[0].description).toBe('First task')

  const descOrderResponse = await request(app)
    .get('/tasks')
    .query({ sortBy: 'createdAt:desc' })
    .set(...userOneAuthHeader)
    .expect(200)

  expect(descOrderResponse.body[0].description).toBe('Second task')
})

test('Should sort tasks by updatedAt', async () => {
  const ascOrderResponse = await request(app)
    .get('/tasks')
    .query({ sortBy: 'updatedAt:asc' })
    .set(...userOneAuthHeader)
    .expect(200)

  expect(ascOrderResponse.body[0].description).toBe('First task')

  const descOrderResponse = await request(app)
    .get('/tasks')
    .query({ sortBy: 'updatedAt:desc' })
    .set(...userOneAuthHeader)
    .expect(200)

  expect(descOrderResponse.body[0].description).toBe('Second task')
})

test('Should return 2 tasks of userOne', async () => {
  const response = await request(app)
    .get('/tasks')
    .set(...userOneAuthHeader)
    .expect(200)

  expect(response.body.length).toBe(2)
})

test('Should fetch user task by id', async () => {
  await request(app)
    .get(`/tasks/${taskOne._id}`)
    .set(...userOneAuthHeader)
    .expect(200)
})

test('Should not fetch user task by id if unauthenticated', async () => {
  await request(app)
    .get(`/tasks/${taskOne._id}`)
    .expect(401)
})

test('Should not fetch other users task by id', async () => {
  await request(app)
    .get(`/tasks/${taskOne._id}`) // Belongs to userOne
    .set(...userTwoAuthHeader)
    .expect(404)
})

test('Should delete taskOne of userOne', async () => {
  await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set(...userOneAuthHeader)
    .expect(200)
})

test('Should not delete task if unauthenticated', async () => {
  await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .expect(401)
})

test(`Should fail for userTwo to delete taskOne of userOne`, async () => {
  await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set(...userTwoAuthHeader)
    .expect(404)

  const task = await Task.findById(taskOne._id)
  expect(task).not.toBeNull()
})
