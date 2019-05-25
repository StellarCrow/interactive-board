const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let ImageSchema = new Schema({
    media: {
        type: Schema.Types.ObjectId,
        ref: 'Media'
    },
    name: String,
    color: String,
    type: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Image',ImageSchema);