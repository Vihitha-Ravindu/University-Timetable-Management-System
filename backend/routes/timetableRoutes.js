const express = require('express')
const router = express.Router()
const {getTimetable, getTimtables, setSession, updateSession, deleteSession} = require('../controllers/timetableController')
const {adminAndFacultyProtect} = require('../middleware/authMiddleware')

// Route to handle GET and POST requests for booking
router.route('/').get(getTimtables).post( setSession)

// Route to handle GET, PUT, and DELETE requests for a specific room identified by its ID
router.route('/:id').get(getTimetable).put( updateSession).delete(adminAndFacultyProtect, deleteSession)

module.exports = router