const asyncHandler = require('express-async-handler')
const Booking = require('../models/bookingModel')
const Notification = require('../models/notificationmodel')

// @desc Get bookings
// @route GET /api/room
// @access Private.
const getBookings = asyncHandler(async(req, res) => {
    try {
        //get bookings from the database
        const booking = await Booking.find()

        //check wether booking is empty
        if(!booking){
            return res.status(404).json({ message: 'Bookings not found'})
        }

        res.status(200).json(booking)
        
    } catch (error) {
        console.error('Error retrieving rooms:', error);
        res.status(500).json({ message: 'Internal server error' })
    }
})

// @desc Get booking
// @route GET /api/room/:id
// @access Private.
const getBooking = asyncHandler(async(req, res) => {
    try {
        //get bookings from the database
        const booking = await Booking.find(req.params.id)

        //check wether bookings exists
        if(!booking){
            return res.status(404).json({ message: 'Bookings are not found'})
        }

        res.status(200).json(booking)
        
    } catch (error) {
        console.error('Error retrieving rooms:', error);
        res.status(500).json({ message: 'Internal server error' })
    }
})

// @desc Get bookings by course
// @route GET /api/booking/course/:courseId
// @access Private
const getBookingsByCourse = asyncHandler(async(req, res) => {
    try {
        //get courseid 
        const courseId = req.params.id

        // Find bookings by course ID
        const bookings = await Booking.find({ course: courseId })

        //check for existing bookings
        if (bookings.length == 0) {
            return res.status(404).json({ message: 'Bookings not found for the specified course' })
        }

        res.status(200).json(bookings)
        
    } catch (error) {
        console.error('Error retrieving bookings by course:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
});

// @desc Get bookings by room
// @route GET /api/booking/room/:roomId
// @access Private
const getBookingsByRoom = asyncHandler(async(req, res) => {
    try {
         //get courseid 
        const roomId = req.params.id

        // Find bookings by room ID
        const bookings = await Booking.find({ room: roomId })

         //check for existing bookings
        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ message: 'Bookings not found for the specified room' })
        }

        res.status(200).json(bookings)
        
    } catch (error) {
        console.error('Error retrieving bookings by room:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
});

// @desc Set booking
// @route POST /api/room
// @access Private
const setBooking = asyncHandler(async (req, res) => {
    try {
        // Get data from body
        const { room, day, starttime, endtime, course, user } = req.body;

        // Validate the required fields
        if (!room || !day || !starttime || !endtime || !course || !user) {
             return res.status(400).json({ message: 'Missing required fields' });
        }

        // Retrieve existing bookings for the specified room and day
        const existingBookings = await Booking.find({
            room,
            day,
            $or: [
                { $and: [{ startTime: { $lte: starttime } }, { endTime: { $gte: starttime } }] }, // New booking start within existing booking
                { $and: [{ startTime: { $lt: endtime } }, { endTime: { $gte: endtime } }] }, // New booking ends within existing booking
                { $and: [{ startTime: { $gte: starttime } }, { endTime: { $lte: endtime } }] } // Existing booking within new booking
            ]
        });

        // Check for overlapping bookings
        if (existingBookings.length > 0) {
            return res.status(400).json({ message: 'Cannot create booking due to overlapping times' });
        }

        // Create the new booking
        const newBooking = await Booking.create({
            room: room,
            day: day,
            startTime: starttime,
            endTime: endtime,
            course: course,
            user: user
        });

        res.status(201).json(newBooking);

    } catch (error) {
        console.error('Error creating the booking: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// @desc Update booking
// @route PUT /api/room/:id
// @access Private
const updateBooking = asyncHandler(async(req, res) => {
    try {
        //get the data from the body
        const { room, day, starttime, endtime, course, user } = req.body;

        // Validate the required fields
        if (!room || !day || !starttime || !endtime || !course || !user) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const booking = await Booking.findById(req.params.id)

        if(!booking){
            return res.status(404).json({ message: 'Booking not found'})
        }

        // Find existing bookings that overlap with the new booking times
        const existingBookings = await Booking.find({
            room,
            day,
            $or: [
                { $and: [{ startTime: { $lte: starttime } }, { endTime: { $gte: starttime } }] }, // New booking start within existing booking
                { $and: [{ startTime: { $lt: endtime } }, { endTime: { $gte: endtime } }] }, // New booking ends within existing booking
                { $and: [{ startTime: { $gte: starttime } }, { endTime: { $lte: endtime } }] } // Existing booking within new booking
            ]
        });

        // Check for overlapping bookings
        if (existingBookings.length > 0) {
            return res.status(400).json({ message: 'Cannot create booking due to overlapping times' });
        }

        const UpdatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        })

        // Create a notification for the session update
        const notification = await Notification.create({
            title: 'Change of TimeTable  session',
            type: 'timetable_change',
            message: `Session ${req.params.id} has been updated. Course: ${course}, Day: ${day}, Start Time: ${starttime}, End Time: ${endtime}`,
                    
        });

        res.status(200).json(UpdatedBooking)



    } catch (error) {
        console.error('Error updating the booking: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

// @desc Delete booking
// @route DELETE /api/booking/:id
// @access Private
const deletebooking = asyncHandler(async(req, res) => {
    try {
        //finding and deleting room
        const deletedBooking = await Booking.findByIdAndDelete(req.params.id)

        //check for booking
        if(!deletedBooking){
            return res.status(404).json({ message: 'Booking not found'})
        }

        res.status(200).json({id: req.params.id, message: 'Successfully deleted booking'})
        
    } catch (error) {
        console.error('Error deleting the booking: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

module.exports = {
    getBooking,
    getBookings,
    getBookingsByCourse,
    getBookingsByRoom,
    setBooking,
    updateBooking,
    deletebooking
}