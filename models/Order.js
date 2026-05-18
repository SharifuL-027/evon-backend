const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // Customer Info
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerAddress: { type: String, required: true },
  
  // Product Info
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  size: { type: String },
  color: { type: String },
  totalAmount: { type: Number, required: true },
  
  // Order Status (Pending, Shipped, Delivered)
  status: { type: String, default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);