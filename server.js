const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.redirect('/admin.html');
});

app.use(express.static('public'));

const productRoutes = require('./routes/products');
app.use('/api/products', productRoutes);

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  family: 4,
  directConnection: false
})
  .then(() => console.log('MongoDB Connected!'))
  .catch(err => console.log('DB Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`QUANTAIP Server running on port ${PORT}`);
});