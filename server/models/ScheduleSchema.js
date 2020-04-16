const mongoose = require('mongoose')

const ScheduleSchema = new mongoose.Schema({
  scheduler: {type: mongoose.Schema.Types.ObjectId},
  barber: {type: mongoose.Schema.Types.ObjectId},
  time: {type: Date}
})

module.exports = mongoose.model('Schedule', ScheduleSchema)
