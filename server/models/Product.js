const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add product name'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Please add product price'],
  },
  stock: {
    type: Number,
    required: [true, 'Please add stock count'],
    default: 0,
  },
  category: {
    type: String,
    required: [true, 'Please add product category'],
    trim: true,
  },
  images: {
    type: [String],
    default: [],
  },
  description: {
    type: String,
    required: [true, 'Please add product description'],
    trim: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', ProductSchema);
