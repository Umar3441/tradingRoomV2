const mongoose = require('mongoose');

const schema = new mongoose.Schema(
    {
        symbol: {
            type: String,
            required: true,
            unique: true,


        },
        expired: {
            type: Boolean,
            default: false
        }
    }
)

module.exports = mongoose.model('btc_coins', schema, 'btc_coins')