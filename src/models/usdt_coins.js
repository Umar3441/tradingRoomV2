const mongoose = require('mongoose');

const schema = new mongoose.Schema(
    {
        symbol: {
            type: String,
            required: true,
            // unique: true

        }
    }
)

module.exports = mongoose.model('usdt_coins', schema, 'usdt_coins')