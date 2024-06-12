const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, maxlength: 255 },
    brand: { type: String, maxlength: 100 },
    style: { type: String, enum: ['casual', 'athletic', 'formal', 'Casual'] },
    price: { type: mongoose.Decimal128 },
    color: { type: String, maxlength: 50 },
    size: { type: String, enum: ['S', 'M', 'L', 'XL'] },
    imageURL: { type: String, maxlength: 255 },
    score: { type: Number, default: 0 },
    availability: { type: Boolean, default: true },
    gender: { type: String, enum: ['male', 'female', 'both'], lowercase: true }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;