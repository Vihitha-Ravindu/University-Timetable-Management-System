const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const Admin = require('../models/adminModel')

// @desc Register Admin
// @route POST /api/admin
// @access Public
const registerAdmin = asyncHandler(async(req, res) => {
    try {
        const { name, email, password, role } = req.body

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'Please enter all required fields' })
        }

        // Check if admin exists
        const adminExists = await Admin.findOne({ email })

        if (adminExists) {
            return res.status(400).json({ message: 'Admin already exists' })
        }

        // Hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Create admin
        const admin = await Admin.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        if (admin) {
            res.status(201).json({
                _id: admin.id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                token: generateToken(admin._id, admin.role),
            });
        } else {
            return res.status(400).json({ message: 'Invalid admin data' })
        }
    } catch (error) {
        console.error('Error registering admin:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

// @desc Authenticate Admin
// @route POST /api/admin/login
// @access Public
const loginAdmin = asyncHandler(async(req, res) => {
    try {
        const { email, password } = req.body

        const admin = await Admin.findOne({ email })

        //check wether admin exists
        if(!admin){
            return res.status(404).json({ message: 'admin not found'})
        }

        //authenticate username and password
        if (admin && (await bcrypt.compare(password, admin.password))) {
            res.json({
                _id: admin.id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                token: generateToken(admin._id, admin.role),
            });
        } else {
            return res.status(400).json({ message: 'Invalid credentials' })
        }
    } catch (error) {
        console.error('Error authenticating admin:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

// @desc Update Admin Data
// @route PUT /api/admin
// @access Private
const updateAdmin = asyncHandler(async(req, res) => {
    try {
        const adminId = req.admin
        const { name, email, password, role } = req.body
        let admin = await Admin.findById(adminId)

        //check wether admin exists
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' })
        }

        // Update the admin fields if they're provided
        if (name) {
            admin.name = name
        }
        if (email) {
            admin.email = email
        }
        if (password) {
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)
            admin.password = hashedPassword;
        }
        if (role) {
            admin.role = role
        }

        // Save the updated admin
        admin = await admin.save()

        res.status(200).json({
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role
        });
    } catch (error) {
        console.error('Error updating admin:', error);
        res.status(500).json({ message: 'Internal server error' })
    }
})

// @desc Delete Admin Data
// @route DELETE /api/admin/
// @access Private
const deleteAdmin = asyncHandler(async(req, res) => {
    try {
        const userId = req.admin
        const user = await Admin.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Delete the user
        const deletedAdmin = await Admin.findByIdAndDelete(userId);

        if (!deletedAdmin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        res.status(200).json({ message: 'Admin deleted successfully' });
    } catch (error) {
        console.error('Error deleting Admin:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// @desc Get Admin Data
// @route GET /api/admin/me
// @access Private
const getAdminMe = asyncHandler(async(req, res) => {
    try {
        const {_id, name, email, role} = await Admin.findById(req.admin.id)

        if (!_id) {
            return res.status(404).json({ message: 'Admin not found' })
        }

        res.status(200).json({
            id: _id,
            name,
            email,
            role
        });
    } catch (error) {
        console.error('Error fetching admin data:', error)
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
    registerAdmin,
    loginAdmin,
    deleteAdmin,
    updateAdmin,
    getAdminMe

}