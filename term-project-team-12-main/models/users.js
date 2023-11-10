const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
    },
    surname: {
        type: String,
    },
    admin: {
        type: Boolean,
        default: false
    },
    created: {
        type: Date,
        default: Date.now
    },
}, { collection: 'users' });

const User = mongoose.model('users', userSchema);

module.exports = User;

