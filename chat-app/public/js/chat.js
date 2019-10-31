const socket = io()

// Elements
const form = document.getElementById('message-form')
const sendButton = document.getElementById('sendButton')
const messageInput = document.getElementById('messageInput')
const shareLocationButton = document.getElementById('send-location')
const messagesContainer = document.getElementById('messages')

// Templates
const messageTemplate = document.getElementById('message-template').innerHTML
const locationTemplate = document.getElementById('location-message-template').innerHTML
const sidebarTemplate = document.getElementById('sidebar-template').innerHTML

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
  // New message element
  const newMessage = messagesContainer.lastElementChild

  // Height of the new message
  const newMessageStyles = getComputedStyle(newMessage)
  const newMessageMargin = parseInt(newMessageStyles.marginBottom)
  const newMessageHeight = newMessage.offsetHeight + newMessageMargin

  // Visible height
  const visibleHeight = messagesContainer.offsetHeight

  // Height of messages container
  const containerHeight = messagesContainer.scrollHeight

  // How far have I scrolled?
  const scrollOffset = messagesContainer.scrollTop + visibleHeight

  if (containerHeight - newMessageHeight <= scrollOffset) {
    messagesContainer.scrollTop = messagesContainer.scrollHeight
  }
}

socket.on('roomData', ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users
  })
  document.getElementById('sidebar').innerHTML = html
})

socket.on('newMessage', ({ text, username, createdAt }) => {
  const html = Mustache.render(messageTemplate, {
    message: text,
    username,
    createdAt: moment(createdAt).format('k:mm')
  })
  messagesContainer.insertAdjacentHTML('beforeend', html)
  autoscroll()
})

socket.on('locationMessage', ({ url, username, createdAt }) => {
  const html = Mustache.render(locationTemplate, {
    url,
    username,
    createdAt: moment(createdAt).format('k:mm')
  })
  messagesContainer.insertAdjacentHTML('beforeend', html)
  autoscroll()
})

form.addEventListener('submit', e => {
  e.preventDefault()

  sendButton.setAttribute('disabled', true)
  socket.emit('sendMessage', messageInput.value, error => {
    sendButton.removeAttribute('disabled')

    if (error) {
      console.log(error)
    } else {
      messageInput.value = ''
      messageInput.focus()
    }
  })
})

shareLocationButton.addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation is not supported by your browser')
  }

  shareLocationButton.setAttribute('disabled', true)
  navigator.geolocation.getCurrentPosition(({ coords }) => {
    socket.emit(
      'sendLocation',
      {
        lat: coords.latitude,
        long: coords.longitude
      },
      () => {
        shareLocationButton.removeAttribute('disabled')
      }
    )
  })
})

socket.emit('join', { room, username }, error => {
  if (error) {
    alert(error)
    location.href = '/'
  }
})
