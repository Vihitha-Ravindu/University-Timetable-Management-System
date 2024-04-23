const express = require('express')
const router = express.Router()
const { registerAdmin, loginAdmin, deleteAdmin, updateAdmin, getAdminMe} = require('../controllers/adminControllers')
const {adminProtect} = require('../middleware/authMiddleware')

//admin routes with protecetion of end points
router.route('/').get(adminProtect, getAdminMe).post(registerAdmin).delete(adminProtect, deleteAdmin).put(adminProtect, updateAdmin)

//login admin route
router.route('/adminlog').post(loginAdmin)

module.exports = router