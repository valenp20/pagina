const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  id: { type: Number },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, default: '' },
  discount: { type: Number, default: 0 },
  category: { type: String, default: '' },
  weeklyOffer: { type: Boolean, default: false }
}, { timestamps: true });

// If you will use MongoDB's native _id, it's ok — we keep an `id` field for compatibility
module.exports = mongoose.models.Product || mongoose.model('Product', ProductSchema);
