const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let BoardSchema = new Schema({
    name: {
        type: String,
        default: "Без названия"
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    is_public: {
        type: Boolean,
        default: false,
        required: true
    },
    background: {
        type: String,
        default: "#fcfcfc"
    },
    notes: [{
        type: Schema.Types.ObjectId,
        ref: 'Media'
    }],
    images: [{
        type: Schema.Types.ObjectId,
        ref: 'Media'
    }],
    audios: [{
        type: Schema.Types.ObjectId,
        ref: 'Media'
    }]
});

module.exports = mongoose.model('Board', BoardSchema);
