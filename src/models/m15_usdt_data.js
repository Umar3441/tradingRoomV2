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
module.exports = mongoose.model('m15_usdt_data', schema, 'm15_usdt_data')