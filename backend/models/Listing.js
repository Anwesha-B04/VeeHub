const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: String,
  alt: String
});

const listingSchema = new mongoose.Schema({
  seller: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  title: String,
  make: String,
  model: String,
  year: Number,
  price: Number,
  mileage: Number,
  fuelType: String,
  location: String,
  description: String,
  images: [imageSchema],
  condition: {type: String, enum: ['excellent','good','fair','poor'], default: 'good'},
  createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Listing', listingSchema);
