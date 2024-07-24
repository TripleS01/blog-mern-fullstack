const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/, 'Invalid Email Address!']
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^[a-zA-Z0-9]+$/, 'No white space allowed!']
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        default: 'N/A'
    },
    sex: {
        type: String,
        default: 'N/A'
    },
    birthDate: {
        type: Date,
        default: null
    },
    location: {
        type: String,
        default: 'N/A'
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
    }],
}, {
    timestamps: true,
    // created at, updated at
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
