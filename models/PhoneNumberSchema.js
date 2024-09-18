const mongoose = require('mongoose');

const PhoneNumber = new mongoose.Schema({
    number : String,
    country : String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PhoneNumber', PhoneNumber);