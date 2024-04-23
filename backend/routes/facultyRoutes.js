const express = require('express')
const router = express.Router()
const { registerFaculty, loginFaculty, getAllFaculty, updateFaculty, deleteFaculty} = require('../controllers/facultyController')
const { facultyProtect, adminProtect, adminAndFacultyProtect} = require('../middleware/authMiddleware')

//routes to get post and put
router.route('/').get(adminProtect, getAllFaculty).post(registerFaculty).put(facultyProtect, updateFaculty)

//route to delete by admins
router.route('/:id').delete(adminProtect, deleteFaculty)

//route to faculty login
router.route('/flogin').post(loginFaculty)


module.exports = router