const mongoose = require('mongoose');


const schema = new mongoose.Schema({
    symbol: {
        type: String,
        unique: true,
        required: true,

    },
    data: [
        [String]
    ]
})
module.exports = mongoose.model('h1_btc_data', schema, 'h1_btc_data')