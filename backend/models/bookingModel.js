const mongoose = require('mongoose')

const bookingSchema = mongoose.Schema({
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: [true, 'Please specify the room for the booking']
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
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        
    },
    user: {
        type: String,
    }
}, {
    timestamps: true,
})

module.exports = mongoose.model('Booking', bookingSchema)