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
module.exports = mongoose.model('d1_data', schema, 'd1_data')