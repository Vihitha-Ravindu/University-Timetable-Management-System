const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['timetable_change', 'room_change', 'announcement'],
        required: true
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Notification', notificationSchema)