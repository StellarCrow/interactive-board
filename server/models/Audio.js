const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let AudioSchema = new Schema({
    media: {
        type: Schema.Types.ObjectId,
        ref: 'Media'
    },
    name: String,
    type: String,
    link: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Audio', AudioSchema);