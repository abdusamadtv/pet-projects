const mongoose = require('mongoose')

module.exports = {
  connectToDb: () => {
    mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    })
  }
}
