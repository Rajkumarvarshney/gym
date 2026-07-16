const mongoose = require('mongoose');

const TimingSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    unique: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  },
  openTime: {
    type: String,
    default: '06:00',
  },
  closeTime: {
    type: String,
    default: '22:00',
  },
  isClosed: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Timing', TimingSchema);
