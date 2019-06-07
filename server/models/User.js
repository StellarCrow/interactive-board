const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let UserSchema = new Schema ({
    username: {
        type: String,
        unique: true,
        required: true
    },
    fullName: String,
    password: {
        type: String,
        required: true
    },
    avatar: String,
    boards: [{type: Schema.Types.ObjectId, ref: 'Board'}],
    email: {
        type: String,
        required: true
    },
    description: String
});

module.exports = mongoose.model('User', UserSchema);
