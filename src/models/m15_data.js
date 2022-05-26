const mongoose = require('mongoose');


const schema = new mongoose.Schema({
    symbol: {
        type: String,
        unique: true,
        required: true,

    },
    data: [
        [String,
            { _id: false }
        ],

    ]
})
module.exports = mongoose.model('m15_data', schema, 'm15_data')