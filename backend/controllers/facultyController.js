const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const Faculty = require('../models/facultyModel')

// @desc Register Faculty
// @route POST /api/faculty
// @access Public
const registerFaculty = asyncHandler(async(req, res) => {
    try {
        const { name, email, password, description, code, role } = req.body

        if (!name || !email || !password || !description || !code || !role) {
            return res.status(400).json({ message: 'Please enter all required fields' })
        }

        // Check if faculty exists
        const facultyExists = await Faculty.findOne({ email })

        if (facultyExists) {
            return res.status(400).json({ message: 'Faculty already exists' })
        }

        // Hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Create faculty
        const faculty = await Faculty.create({
            name,
            email,
            password: hashedPassword,
            description,
            code,
            role
        });

        if (faculty) {
            res.status(201).json({
                _id: faculty.id,
                name: faculty.name,
                email: faculty.email,
                description: faculty.description,
                code: faculty.code,
                role: faculty.role,
                token: generateToken(faculty._id, faculty.role),
            });
        } else {
            return res.status(400).json({ message: 'Invalid faculty data' })
        }
    } catch (error) {
        console.error('Error registering faculty:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

// @desc Authenticate Faculty
// @route POST /api/faculty/login
// @access Public
const loginFaculty = asyncHandler(async(req, res) => {
    try {
        const { email, password } = req.body

        //get the faculty by email
        const faculty = await Faculty.findOne({ email })

        //authenticate the password
        if (faculty && (await bcrypt.compare(password, faculty.password))) {
            res.json({
                _id: faculty.id,
                name: faculty.name,
                email: faculty.email,
                description: faculty.description,
                code: faculty.code,
                role: faculty.role,
                token: generateToken(faculty._id, faculty.role),
            });
        } else {
            return res.status(400).json({ message: 'Invalid credentials' })
        }
    } catch (error) {
        console.error('Error authenticating faculty:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

// @desc Get All Faculty Members
// @route GET /api/admin/faculty
// @access Private (Admin only)
const getAllFaculty = asyncHandler(async (req, res) => {
    try {
        const facultyMembers = await Faculty.find()

        if(!facultyMembers){
            return res.status(404).json({ message: 'Faculties not found'})
        }

        res.status(200).json(facultyMembers)
    } catch (error) {
        console.error('Error fetching all faculty members:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

// @desc Update Faculty Member
// @route PUT /api/admin/faculty/
// @access Private 
const updateFaculty = asyncHandler(async (req, res) => {
    try {
        const facultyId = req.faculty.id;
        const { name, email, description, code, role } = req.body

        let faculty = await Faculty.findById(facultyId)

        if (!faculty) {
            return res.status(404).json({ message: 'Faculty member not found' })
        }

        // Update the faculty member's fields if they're provided
        if (name) {
            faculty.name = name
        }
        if (email) {
            faculty.email = email
        }
        if (description) {
            faculty.description = description
        }
        if (code) {
            faculty.code = code
        }
        if (role) {
            faculty.role = role
        }

        // Save the updated faculty member
        faculty = await faculty.save()

        res.status(200).json(faculty)
    } catch (error) {
        console.error('Error updating faculty member:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

// @desc Delete Faculty Member
// @route DELETE /api/admin/faculty/:id
// @access Private (Admin only)
const deleteFaculty = asyncHandler(async (req, res) => {
    try {
        const facultyId = req.params.id
        const faculty = await Faculty.findById(facultyId)

        if (!faculty) {
            return res.status(404).json({ message: 'Faculty member not found' })
        }

        // Delete the faculty member
        await Faculty.findByIdAndDelete(facultyId)

        res.status(200).json({ message: 'Faculty member deleted successfully' })
    } catch (error) {
        console.error('Error deleting faculty member:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

//Generate JWT
const generateToken = (id, role) => {
    return jwt.sign({ id, role}, process.env.JWT_SECRET, {
        expiresIn: '10d'
    } )
}

module.exports = {
    registerFaculty,
    loginFaculty,
    getAllFaculty,
    updateFaculty,
    deleteFaculty
}