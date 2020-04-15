const mongoose = require('mongoose')

const BarberSchema = new mongoose.Schema({
  shop_name: {type: String},
  user_ref_id: {type: mongoose.Schema.Types.ObjectId},
  item_menus: {type: Array},
  recent_story: {type: String},
  location: {type: Array}
})

module.exports = mongoose.model('Barber', BarberSchema)
