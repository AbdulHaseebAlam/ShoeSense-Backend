const Product = require('../models/products');
const Order = require('../models/orders');
var braintree = require("braintree");
const mongoose = require('mongoose');
const { Decimal128 } = mongoose.Types;


var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

const featuredProducts = async (req, res) => {
    try {
        // Fetch top 12 products based on score
        const products = await Product.find().sort({ score: -1 }).limit(12);
        res.json({
            success: true,
            data: products,
            message: "Featured Products sent successfully"
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Failed to fetch products' });
    }
}

const productInfo = async (req, res) => {
    const { productID } = req.params;
    try {
        const product = await Product.findById(productID);
        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }
        res.json({
            success: true,
            data: product,
            message: "Product sent successfully"
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Failed to fetch product details' });
    }
}

const productsMen = async (req, res) => {
    try {
        const products = await Product.find({ gender: { $in: ['male', 'both'] } });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const productsWomen = async (req, res) => {
    try {
        const products = await Product.find({ gender: { $in: ['female', 'both'] } });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const latestProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch the latest products', error });
    }
};

const incrementProductScore = async (req, res) => {
    const { productID, action } = req.body;

    try {
        const product = await Product.findById(productID);
        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        let incrementValue;
        if (action === 'click') {
            incrementValue = 1;
        } else if (action === 'purchase') {
            incrementValue = 3;
        } else {
            return res.status(400).json({ success: false, error: 'Invalid action' });
        }

        product.score += incrementValue;
        await product.save();

        res.json({ success: true, message: 'Product score updated successfully' });
    } catch (err) {
        console.error('Error updating product score:', err);  // Log the actual error
        res.status(500).json({ success: false, error: 'Failed to update product score' });
    }
};

const braintreeTokenController = async (req, res) => {
    try {
        gateway.clientToken.generate({}, function (err, response) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(response);
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

const brainTreePaymentController = async (req, res) => {
    try {
        const { nonce, cart, auth, totalPrice } = req.body;
        // let total = 0;
        // cart.forEach((item) => {
        //     total += item.price;
        // });

        gateway.transaction.sale(
            {
                amount: totalPrice, // Ensure the total is in correct format for Braintree
                paymentMethodNonce: nonce,
                options: {
                    submitForSettlement: true,
                },
            },
            async (error, result) => {
                if (result) {
                    try {
                        const order = new Order({
                            userID: auth.userData.id,
                            totalAmount: Decimal128.fromString((parseFloat(totalPrice)).toFixed(2)),
                            status: 'Pending',
                            products: cart.map((item) => item._id),
                        });

                        await order.save();
                        res.json({ ok: true, order });
                    } catch (saveError) {
                        console.error('Order save error:', saveError);
                        res.status(500).send('Error saving order');
                    }
                } else {
                    console.error('Transaction error:', error);
                    res.status(500).send(error);
                }
            }
        );
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    featuredProducts,
    productInfo,
    productsMen,
    productsWomen,
    latestProducts,
    braintreeTokenController,
    brainTreePaymentController,
    incrementProductScore
};