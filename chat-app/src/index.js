const http = require('http')
const path = require('path')
const express = require('express')
const socketio = require('socket.io')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', socket => {
  console.log('New connection')

  socket.on('join', (options, callback) => {
    const { user, error } = addUser({ id: socket.id, ...options })

    if (error) {
      return callback(error)
    }

    socket.join(user.room)

    socket.emit('newMessage', generateMessage('Admin', 'Welcome!'))
    socket.broadcast.to(user.room).emit('newMessage', generateMessage('Admin', `${user.username} has joined!`))
    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room)
    })

    callback()
  })

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id)

    try {
      io.to(user.room).emit('newMessage', generateMessage(user.username, message))
      callback()
    } catch (e) {
      callback(e)
    }
  })

  socket.on('sendLocation', (coords, confirm) => {
    const user = getUser(socket.id)

    io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, coords))
    confirm()
  })

  socket.on('disconnect', () => {
    const user = removeUser(socket.id)

    if (user) {
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.username} has left!`))
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room)
      })
    }
  })
})

server.listen(port, () => {
  console.log(`Server is up on port ${port}`)
})
