const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let NoteSchema = new Schema({
    media: {
        type: Schema.Types.ObjectId,
        ref: 'Media'
    },
    text: String,
    color: String
});

module.exports = mongoose.model('Note', NoteSchema);