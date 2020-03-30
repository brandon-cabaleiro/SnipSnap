const mongoose = require('mongoose')

const BarberSchema = new mongoose.Schema({
  shop_name: {type: String},
  user_ref_id: {type: mongoose.Schema.Types.ObjectId}
})

module.exports = mongoose.model('Barber', BarberSchema)
