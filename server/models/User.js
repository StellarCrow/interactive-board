const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let UserSchema = new Schema ({
    username: {
        type: String,
        unique: true,
        required: true
    },
    firstName: String,
    lastName: String,
    password: {
        type: String,
        required: true
    },
    boards: [{type: Schema.Types.ObjectId, ref: 'Board'}],
    email: {
        type: String,
        required: true
    },
    description: String
});

module.exports = mongoose.model('User', UserSchema);
