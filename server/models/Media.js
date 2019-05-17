const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let MediaSchema = new Schema({
    board: {
        type: Schema.Types.ObjectId,
        ref: 'Board',
        required: true
    },
    date: Date,
    type: {
        type: Schema.Types.ObjectId,
        ref: 'Note' || 'Image' || 'Audio',
        required: true
    },
    coordinates: {
        type: [Number, Number],
        required: true
    }
});

module.exports = mongoose.model('Media', MediaSchema);