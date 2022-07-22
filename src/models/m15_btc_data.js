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
module.exports = mongoose.model('m15_btc_data', schema, 'm15_btc_data')