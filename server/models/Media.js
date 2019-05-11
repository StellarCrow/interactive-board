const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let MediaSchema = new Schema({
    name: String,
    board: {
        type: Schema.Types.ObjectId,
        ref: 'BoardSchema',
        required: true
    },
    link: String,
    date: Date,
    type: String,
    coordinates: {
        type: [Number, Number],
        required: true
    }
});

module.exports = mongoose.model('Media', MediaSchema);