const users = []

const addUser = ({ id, username, room }) => {
  room = room.trim().toLowerCase()
  username = username.trim().toLowerCase()

  if (!room || !username) {
    return { error: 'Username and room are required!' }
  }

  const userExistsAlready = users.find(user => user.room === room && user.username === username)

  if (userExistsAlready) {
    return { error: 'Username is in use!' }
  }

  const user = { id, room, username }
  users.push(user)
  return { user }
}

const removeUser = id => {
  const index = users.findIndex(user => id === user.id)

  if (index !== -1) {
    return users.splice(index, 1)[0]
  }
}

const getUser = id => users.find(user => user.id === id)

const getUsersInRoom = room => users.filter(user => user.room === room.trim().toLowerCase())

module.exports = {
  addUser,
  getUser,
  removeUser,
  getUsersInRoom
}
