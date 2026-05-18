const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// 1. IMPORT YOUR ROUTE FILE HERE (Make sure the folder name matches!)
const productRoutes = require('./routes/productRoutes'); // <-- ADD THIS

const app = express();

// Middlewares
app.use(cors()); 
app.use(express.json()); 

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB successfully!'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// 2. CONNECT THE ROUTE HERE (Must be below app.use(express.json()) )
app.use('/api/products', productRoutes); // <-- ADD THIS

// Basic Test Route
app.get('/', (req, res) => {
  res.send('EVON Backend API is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});