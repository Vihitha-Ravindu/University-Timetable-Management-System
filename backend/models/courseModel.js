const mongoose = require('mongoose')

const courseSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter a name for the course']
    },
    code: {
        type: String,
        required: [true, 'Please enter a code for the course'],
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description to the course']
    },
    credits: {
        type: Number,
        required: [true, 'Please add no of credits for the course']
    },
    faculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Faculty',
        required: [true, 'Please add a faculty']
    },
}, {
    timestamps: true,
})

module.exports = mongoose.model('Course', courseSchema)