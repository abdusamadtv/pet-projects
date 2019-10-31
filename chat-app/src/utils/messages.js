const generateMessage = (username, text) => ({ text, username, createdAt: new Date().getTime() })
const generateLocationMessage = (username, { lat, long }) => ({
  url: `https://google.com/maps?q=${lat},${long}`,
  username,
  createdAt: new Date().getTime()
})

module.exports = {
  generateMessage,
  generateLocationMessage
}
