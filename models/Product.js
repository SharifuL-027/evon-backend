const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  highestPrice: { type: Number },
  brand: { type: String },
  category: { type: String, required: true },
  stockQuantity: { type: Number, default: 0 },
  description: { type: String, required: true },
  
  // 🌟 THE NEW FIELDS WE ADDED 🌟
  material: { type: String },
  gender: { type: String },
  season: { type: String },
  sizes: [{ type: String }], // Array of strings for sizes
  colors: [{ type: String }], // Array of strings for colors
  
  status: { type: String, default: 'In Stock' },
  
  images: [
    {
      url: { type: String, required: true },
      cloudinary_id: { type: String, required: true }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);