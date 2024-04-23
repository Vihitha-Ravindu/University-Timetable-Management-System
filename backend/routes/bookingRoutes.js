const express = require('express')
const router = express.Router()
const { getBooking, getBookings, getBookingsByCourse, getBookingsByRoom, setBooking, updateBooking, deletebooking} = require('../controllers/bookingController')
const {adminAndFacultyProtect, adminProtect, facultyProtect} = require('../middleware/authMiddleware')

// Route to handle GET and POST requests for booking
router.route('/').get(adminAndFacultyProtect, getBookings).post(adminAndFacultyProtect, setBooking)

// Route to handle GET, PUT and DELETE requests for booking
router.route('/:id').get(adminAndFacultyProtect, getBooking).put(adminAndFacultyProtect, updateBooking).delete(adminAndFacultyProtect, deletebooking)

// Route to handle search by course requests for booking
router.route('/searchCourse/:id').get(adminAndFacultyProtect, getBookingsByCourse)

// Route to handle search by room requests for booking
router.route('/searchRoom/:id').get(adminAndFacultyProtect, getBookingsByRoom)

module.exports = router