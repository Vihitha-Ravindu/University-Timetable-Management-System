const express = require('express')
const router = express.Router()
const { createNotification, getNotifications, displayNotifications } = require('../controllers/notificationController')
const {adminAndFacultyProtect} = require('../middleware/authMiddleware')

//routes to get and set notifications
router.route('/').get(adminAndFacultyProtect, getNotifications).post(adminAndFacultyProtect, createNotification)

//route to display notifications
router.route('/notify').get(displayNotifications)

module.exports = router