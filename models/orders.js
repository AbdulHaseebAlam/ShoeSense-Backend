const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderDate: { type: Date, default: Date.now },
    totalAmount: { type: mongoose.Decimal128 },
    status: { type: String, maxlength: 50 },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }],
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;