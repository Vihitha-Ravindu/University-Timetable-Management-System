const mongoose = require('mongoose');

const facultySchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
    },
    code: {
        type: String,
        required: [true, 'Please provide a code'],
        unique: true,
    },
    role: {
        type: String,
        default: 'faculty',
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Faculty', facultySchema)