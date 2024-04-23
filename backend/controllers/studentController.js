const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/studentModel')

// @desc Register User
// @route POST /api/user
// @access Public
const registerUser = asyncHandler(async(req, res) => {

    const{ name, email, password, role} = req.body

    if(!name || !email || !password || !role){
        return res.status(400).json({ message: 'please enter the required fiels'})
    }

    //check if user exists
    const userExists = await User.findOne({email})

    if(userExists){
        return res.status(400).json({ message: 'User already exists'})
    }

    //Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    //create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role
    })

    if(user){
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        })
    }else{
        return res.status(400).json({ message: 'Invalid user data'})
    }

    
})

// @desc Athenticate User
// @route POST /api/login
// @access Public
const loginUser = asyncHandler(async(req, res) => {

    const { email, password} = req.body

    const user = await User.findOne({email})

    //authenticate password
    if(user && (await bcrypt.compare(password, user.password))){
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        })
    }else{
        return res.status(400).json({ message: 'Invalid credentials'})
    }

})

// @desc Get User Data
// @route GET /api/user/me
// @access Private
const getMe = asyncHandler(async(req, res) => {
    
    const {_id, name, email, role} = await User.findById(req.user.id)

    res.status(200).json({
        id: _id,
        name,
        email,
        role
    })
})

// @desc update User Data
// @route put /api/user
// @access Private
const updateUser = asyncHandler(async(req, res) => {
  try {
        const userId = req.user
        const { name, email, password, role } = req.body
        let user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        // Update the user fields if they're provided
        if (name) {
            user.name = name
        }
        if (email) {
            user.email = email
        }
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt)
            user.password = hashedPassword
        }
        if (role) {
            user.role = role
        }

        // Save the updated user
        user = await user.save()

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        console.error('Error updating user:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

// @desc delete User Data
// @route delete /api/user
// @access Private
const deleteUser = asyncHandler(async(req, res) => {
    try {
        const userId = req.params.id
        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        // Delete the user
        const deletedUser = await User.findByIdAndDelete(userId)

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' })
        }

        res.status(200).json({ message: 'User deleted successfully' })
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal server error' })
    }
});
// @desc Get all User
// @route Get /api/user
// @access Private
const getUsers = asyncHandler(async(req, res) => {
    try {
        const users = await User.find(); // Find all users

        res.status(200).json(users)
    } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json({ message: 'Internal server error' })
    }
})



//Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id}, process.env.JWT_SECRET, {
        expiresIn: '10d'
    } )
}

module.exports = {
    registerUser,
    loginUser,
    updateUser,
    deleteUser,
    getUsers,
    getMe
}