const mongoose = require('mongoose');


const schema = new mongoose.Schema({
    symbol: {
        type: String,
        unique: true,
        required: true,

    },
    data: [
        {
            openTime: String,
            open: String,
            high: String,
            low: String,
            close: String,
            volume: String,
            closeTime: String,
            QuoteAssetvolume: String
        }
    ]
})
module.exports = mongoose.model('d1_data', schema, 'd1_data')