// models/Item.js
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    requested_by: {
        type: String,
    },
    request_status: {
        type: String,
        enum: ['pending', 'approved'],
        default: 'pending'
    },
    lended_by: {
        type: String,
    },
    return_status: {
        type: String,
        enum: ['pending', 'returned'],
        default: 'pending'
    },
    timestamp_request: {
        type: Date,
        default: Date.now
    },
    timestamp_return: {
        type: Date
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    rent_time: {
        type: Number,
        required: true,
        min: 1 // Assuming rent time is in hours or days; adjust as needed
    }
});

module.exports = mongoose.model('Item', itemSchema);
