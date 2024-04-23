const express = require('express')
const router = express.Router()
const { getAllEnrollments, enrollStudent, cancelEnrollment, getStudentEnrollments, cancelStudentEnrollment } = require('../controllers/enrollmentController')
const { protect, adminAndFacultyProtect } = require('../middleware/authMiddleware')

//route to get and set enrollments
router.route('/').get(adminAndFacultyProtect, getAllEnrollments).post(enrollStudent)

//route to get logged in students enrollments
router.route('/senrol').get(protect, getStudentEnrollments)

//route to delete logged in students enrolments
router.route('/senrol/:id').delete(protect, cancelStudentEnrollment)

//route to delete enrollment by admin or facyulty
router.route('/:id').delete(adminAndFacultyProtect, cancelEnrollment)

module.exports = router
