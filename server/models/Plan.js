const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a plan name'],
    trim: true,
    unique: true,
  },
  duration: {
    type: Number,
    required: [true, 'Please add duration in months'],
  },
  price: {
    type: Number,
    required: [true, 'Please add plan price'],
  },
  description: {
    type: String,
    required: [true, 'Please add plan description'],
  },
  benefits: {
    type: [String],
    default: [],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Plan', PlanSchema);
