const mongoose = require('mongoose')

const ItemMenuSchema = new mongoose.Schema({
  menu_name: {type: String},
  menu_options: {type: Array}
})

module.exports = mongoose.model('Itemmenu', ItemMenuSchema)
