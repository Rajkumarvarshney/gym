const mongoose = require('mongoose');

const EquipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add equipment name'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Please add a category (e.g., Cardio, Strength)'],
    trim: true,
  },
  image: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    trim: true,
  },
  quantity: {
    type: Number,
    required: [true, 'Please add quantity'],
    default: 1,
  },
  condition: {
    type: String,
    enum: ['Excellent', 'Good', 'Needs Maintenance', 'Broken'],
    default: 'Excellent',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Equipment', EquipmentSchema);
