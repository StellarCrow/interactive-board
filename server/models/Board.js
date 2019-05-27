const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let BoardSchema = new Schema({
    name: {
        type: String,
        default: "Без названия"
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'UserSchema',
        required: true
    },
    is_public: {
        type: Boolean,
        default: false,
        required: true
    },
    background: {
        type: String,
        default: "#fff"
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
