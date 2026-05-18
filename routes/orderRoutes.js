const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// @route   POST /api/orders
// @desc    Place a new order
router.post('/', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully!', order: newOrder });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Server error while placing order' });
  }
});

// @route   GET /api/orders
// @desc    Get all orders for the Admin Dashboard
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

module.exports = router;