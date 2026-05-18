const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// 1. IMPORT YOUR ROUTE FILES HERE
const productRoutes = require('./routes/productRoutes'); 
const orderRoutes = require('./routes/orderRoutes'); // <-- ADDED THIS FOR ORDERS

const app = express();

// Middlewares
// (Make sure to update cors with your Netlify link if you haven't yet!)
app.use(cors()); 
app.use(express.json()); 

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB successfully!'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// 2. CONNECT THE ROUTES HERE (Must be below app.use(express.json()) )
app.use('/api/products', productRoutes); 
app.use('/api/orders', orderRoutes); // <-- ADDED THIS FOR ORDERS

// Basic Test Route
app.get('/', (req, res) => {
  res.send('EVON Backend API is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});