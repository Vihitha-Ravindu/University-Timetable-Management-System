const asyncHandler = require('express-async-handler')
const Notification = require('../models/notificationmodel')



// @desc Get notifications
// @route GET /api/notifications
// @access Private
const getNotifications = asyncHandler(async(req, res) => {
    try {
        // Get notifications from the database
        const notifications = await Notification.find()

        // Check if there are any notifications
        if(notifications.length === 0){
            return res.status(404).json({ message: 'Notifications not found' })
        }

        res.status(200).json(notifications)
        
    } catch (error) {
        console.error('Error retrieving notifications:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

// @desc Create notification
// @route POST /api/notifications
// @access Private
const createNotification = asyncHandler(async(req, res) => {
    try {
        const { title, type, message } = req.body

        // Validate required fields
        if (!type || !message || !title) {
            return res.status(400).json({ message: 'Please provide title,type and message for the notification' })
        }

        // Create the notification
        const notification = await Notification.create({
            type,
            message,
            title
        })

        res.status(201).json(notification)
    } catch (error) {
        console.error('Error creating notification:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

// @desc Get notifications created less than 2 days ago
// @route GET /api/notifications
// @access Private
const displayNotifications = asyncHandler(async (req, res) => {
    try {
        // Calculate the date two days ago
        const twoDaysAgo = new Date()
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

        // Query notifications created within the last two days
        const notifications = await Notification.find({ createdAt: { $gte: twoDaysAgo } })

        // Check if there are any notifications
        if (notifications.length === 0) {
            return res.status(404).json({ message: 'Notifications created less than 2 days ago not found' })
        }

        // Return the notifications
        res.status(200).json(notifications)
    } catch (error) {
        console.error('Error retrieving notifications:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

module.exports = {
    displayNotifications,
    createNotification,
    getNotifications
}