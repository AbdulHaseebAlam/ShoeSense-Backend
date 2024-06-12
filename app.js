require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
// const path = require('path');

// Models
const User = require('./models/users');
const Product = require('./models/products');
const Order = require('./models/orders');

// Controllers
const { handleLoginController, handleSignupController, handleTestController, updateAddressControlller } = require('./controllers/authController');
const { featuredProducts, productInfo, productsMen, productsWomen, latestProducts, braintreeTokenController, brainTreePaymentController, incrementProductScore } = require('./controllers/productsController');

// Middlewares
const requireSignIn = require('./middlewares/authMiddleware');

// config
const connectDB = require('./config/database');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors(
    {
        origin: 'https://shoesense.vercel.app/',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    }
));

connectDB();

// app.use(express.static(path.resolve(__dirname, "frontend", "dist")));

// Routes
// POST
app.post('/signup', handleSignupController);
app.post('/login', handleLoginController);
app.post('/products/score', incrementProductScore);
app.post('/braintree/payment', requireSignIn, brainTreePaymentController);

app.put('/updateAddress', updateAddressControlller);

// GET
app.get("/", (req, res) => {
    res.send("<h1>I am Runnning Perfectly</h1>");
});

app.get('/products/featured-products', featuredProducts);
app.get('/products/latestProducts', latestProducts);
app.get('/products/product-info/:productID', productInfo);
app.get('/products/men', productsMen);
app.get('/products/women', productsWomen);
app.get('/braintree/token', braintreeTokenController);

app.get('/checkAuth', requireSignIn, (req, res) => {
    res.status(200).json({ message: 'You are authenticated', ok: true });
});

app.listen('3000', function () {
    console.log("server is running on Port 3000");
});
