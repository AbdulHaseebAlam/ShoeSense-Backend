const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, maxlength: 100, required: true },
    email: { type: String, unique: true, required: true, maxlength: 100 },
    password: { type: String, required: true, maxlength: 255 },
    age: { type: Number },
    gender: { type: String, maxlength: 10 },
    address: {
        street: { type: String },
        city: { type: String },
        stateOrProvince: { type: String },
        country: { type: String },
        postalCode: { type: String }
    },
    hobbies: { type: [String] },
    shoeColorPreference: { type: [String], maxlength: 50 },
    shoeBrandPreference: { type: [String], maxlength: 100 },
    priceRangePreference: { type: String, maxlength: 50 }
});

const User = mongoose.model('User', userSchema);

module.exports = User;