const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { upload, cloudinary } = require('../config/cloudinary');

// @route   POST /api/products
// @desc    Add a new product with up to 5 images
// @access  Private (Admin)

// @route   POST /api/products
// @desc    Create a new product
// @access  Private (Admin)
router.post('/', upload.array('images', 5), async (req, res) => {
  try {
    // 1. Catch ALL the text fields from the frontend
    const {
      name, price, highestPrice, brand, category,
      stockQuantity, description, material, gender, season
    } = req.body;

    // 2. Safely parse the sizes and colors arrays
    // FormData sends arrays weirdly, so we force them into actual JavaScript arrays
    let sizesArray = [];
    if (req.body.sizes) {
      sizesArray = Array.isArray(req.body.sizes) ? req.body.sizes : [req.body.sizes];
    }

    let colorsArray = [];
    if (req.body.colors) {
      colorsArray = Array.isArray(req.body.colors) ? req.body.colors : [req.body.colors];
    }

   // Change this block...
const images = req.files.map(file => ({
      url: file.path, 
      cloudinary_id: file.filename // <--- CHANGE THIS FROM public_id TO cloudinary_id
    }));

    // 4. Save to MongoDB
    const newProduct = new Product({
      name,
      price,
      highestPrice,
      brand,
      category,
      stockQuantity,
      description,
      material,
      gender,
      season,
      sizes: sizesArray,
      colors: colorsArray,
      images
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error saving product:', error);
    res.status(500).json({ message: 'Server Error saving product' });
  }
});
// @route   GET /api/products
// @desc    Get all products from MongoDB
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Product.find() grabs everything in the collection
    // .sort({ createdAt: -1 }) ensures the newest shoes show up first!
    const products = await Product.find().sort({ createdAt: -1 }); 
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server Error fetching products' });
  }
});
// @route   GET /api/products/:id
// @desc    Get a single product by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching single product:', error);
    res.status(500).json({ message: 'Server Error fetching product' });
  }
});
// @route   DELETE /api/products/:id
// @desc    Delete a product AND its Cloudinary images (Safely)
// @access  Private (Admin)
router.delete('/:id', async (req, res) => {
  try {
    // 1. Find the product
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // 2. Try to delete images from Cloudinary SAFELY
    if (product.images && product.images.length > 0) {
      for (let i = 0; i < product.images.length; i++) {
        
        // This grabs the ID whether it's an old buggy shoe or a new perfect shoe
        const imageId = product.images[i].cloudinary_id || product.images[i].public_id;
        
        if (imageId) {
          try {
            await cloudinary.uploader.destroy(imageId);
          } catch (cloudErr) {
            // If Cloudinary fails, we just log it and MOVE ON. No crashing!
            console.error(`Could not delete image ${imageId} from Cloudinary, but continuing anyway.`);
          }
        }
      }
    }

    // 3. FORCE DELETE from MongoDB
    await Product.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: 'Product deleted successfully!' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server Error while deleting' });
  }
});
module.exports = router;