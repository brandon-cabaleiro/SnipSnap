const mongoose = require('mongoose')

const BarberSchema = new mongoose.Schema({
  shop_name: {type: String, required: true},
  user_ref_id: {type: mongoose.Schema.Types.ObjectId, required: true}
})

module.exports = mongoose.model('Barber', BarberSchema)
