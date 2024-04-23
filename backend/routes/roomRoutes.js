const express = require('express')
const router = express.Router()
const { getRoom, getRooms, setRoom, updateRoom, deleteRoom } = require('../controllers/roomController')
const { adminAndFacultyProtect} = require('../middleware/authMiddleware')

// Route to handle GET and POST requests for rooms
router.route('/').get(adminAndFacultyProtect, getRooms).post(adminAndFacultyProtect, setRoom)

// Route to handle GET, PUT, and DELETE requests for a specific room identified by its ID
router.route('/:id').get(adminAndFacultyProtect, getRoom).put(adminAndFacultyProtect, updateRoom).delete(adminAndFacultyProtect, deleteRoom)

module.exports = router