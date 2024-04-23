const mongoose = require('mongoose')

const timetableSchema = mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: [true, 'Please specify the course for this timtable entry']
    },
    day: {
        type: String,
        required: [true, 'Please specify the day for this timetable entry']
    },
    startTime: {
        type: Date,
        required: [true, 'Please specify the start time for the booking']
    },
    endTime: {
        type: Date,
        required: [true, 'Please specify the end time for the booking']
    },
    faculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Faculty',
        required: [true, 'Please add a faculty']
    },
    location: {
        type: String,
        required: [true, 'Please specify the location for this timetable entry']
    }
}, {
    timestamps: true,
})

module.exports = mongoose.model('Timetable', timetableSchema)