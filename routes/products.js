const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Product = require('../models/Product');
const dotenv = require('dotenv');
dotenv.config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer — memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// GET — all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST — add product
router.post('/', upload.single('image'), async (req, res) => {
  try {
    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'libas-co' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    const product = new Product({
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      originalPrice: req.body.originalPrice,
      image: result.secure_url,
      label: req.body.label,
      sizes: req.body.sizes.split(',').map(s => s.trim()),
      inStock: true
    });

    await product.save();
    res.json({ success: true, product });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE — remove product
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;