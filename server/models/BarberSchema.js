const mongoose = require('mongoose')

const BarberSchema = new mongoose.Schema({
  shop_name: {type: String},
  user_ref_id: {type: mongoose.Schema.Types.ObjectId},
  item_menus: {type: Array},
  recent_story: {type: String},
  location: {type: Array},
  availability: {type: Array}
})

// availability is array where index corresponds to day index (e.g 0 == monday, 5 == friday).
// The values at these indexes are a pair of begin times and end times of barber's availabilities

module.exports = mongoose.model('Barber', BarberSchema)
