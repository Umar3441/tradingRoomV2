const mongoose = require('mongoose');


const schema = new mongoose.Schema({
    symbol: {
        type: String,
        unique: true,
        required: true,

    },
    data: [
        [String]
    ],

}, { timestamps: true })
module.exports = mongoose.model('m3_usdt_data', schema, 'm3_usdt_data')