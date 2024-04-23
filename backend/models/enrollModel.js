const mongoose = require('mongoose')

const enrollmentSchema = mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Enroll', enrollmentSchema)