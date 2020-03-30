const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  username: {type: String},
  password: {type: String},
  first_name: {type: String},
  last_name: {type: String},
  email: {type: String}
})

module.exports = mongoose.model('User', UserSchema)
