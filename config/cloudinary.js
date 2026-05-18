require('dotenv').config();
const cloudinary = require('cloudinary').v2; // .v2 is required!
const { CloudinaryStorage } = require('multer-storage-cloudinary'); // Curly braces are back!
const multer = require('multer');

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Set up the Storage Engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary, // This links the two packages together
  params: {
    folder: 'evon_store_products',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

// 3. Create Multer Middleware
const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };