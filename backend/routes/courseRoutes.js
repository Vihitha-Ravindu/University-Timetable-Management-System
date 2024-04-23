const express = require('express')
const router = express.Router()
const {getCourse, setCourse, updateCourse, deleteCourse} = require('../controllers/courseController')
const {adminAndFacultyProtect, adminProtect, facultyProtect} = require('../middleware/authMiddleware')

//route to get set courses
router.route('/').get(adminAndFacultyProtect, getCourse).post(setCourse)

//routes to put and delete courses
router.route('/:id').put(adminAndFacultyProtect, updateCourse).delete(adminProtect, deleteCourse)

module.exports = router