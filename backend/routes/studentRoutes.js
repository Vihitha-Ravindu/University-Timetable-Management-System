const express = require('express')
const router = express.Router()
const { registerUser, loginUser, getMe, updateUser, getUsers, deleteUser} = require('../controllers/studentController')
const {protect, adminProtect, adminAndFacultyProtect} = require('../middleware/authMiddleware')

router.post('/', registerUser)//route to register

router.post('/login', loginUser)//route to login 

router.get('/me', protect, getMe)//route to get logged in student details

router.put('/', protect, updateUser)// route to update student

router.get('/', adminAndFacultyProtect, getUsers)//route to view all users

router.delete('/:id', adminAndFacultyProtect, deleteUser)//route to dlete user

module.exports = router