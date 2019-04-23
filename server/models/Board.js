const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let BoardSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'UserSchema',
        required: true
    },
    creationDate: {
        type: Date,
        required: true
    },
    is_public: {
        type: Boolean,
        default: false,
        required: true
    }
});

module.exports = mongoose.model('Board', BoardSchema);