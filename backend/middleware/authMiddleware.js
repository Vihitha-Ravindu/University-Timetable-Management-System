const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/studentModel')
const Admin = require('../models/adminModel')
const Faculty = require('../models/facultyModel')

const protect = asyncHandler(async(req, res, next) => {
    let token 

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            //get token from the header

            token = req.headers.authorization.split(' ')[1]

            //verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            //get user from the token
            req.user = await User.findById(decoded.id).select('-password')

            next()
        } catch (error) {
            console.error('Not Authorized', error)
            res.status(401).json({ message: 'Not authorized'})
        }
    }
    if(!token){
        res.status(401)
        throw new Error('Not authorized, no token')

    }
})

const adminProtect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from the header
            token = req.headers.authorization.split(' ')[1]

            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            // Get user from the token
            req.admin = await Admin.findById(decoded.id).select('-password')

            //get the role from the token
            const role = decoded.role

            if (!role.toLowerCase() === 'admin'){
                return res.status(401).json({ message: 'Not authorized'})
            }

            next()
        } catch (error) {
            console.error('Not Authorized', error)
            res.status(401).json({ message: 'Not authorized' })
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token')
    }
})

const facultyProtect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from the header
            token = req.headers.authorization.split(' ')[1]

            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            // Get faculty member from the token
            req.faculty = await Faculty.findById(decoded.id).select('-password')

            next();
        } catch (error) {
            console.error('Not Authorized', error)
            res.status(401).json({ message: 'Not authorized' })
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token')
    }
});

const adminAndFacultyProtect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from the header
            token = req.headers.authorization.split(' ')[1]

            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            //get the role from the token
            const role = decoded.role

            //check wether role is admin or faculty
            if (!role.toLowerCase() === 'admin' || !role.toLowerCase() === 'faculty'){
                return res.status(401).json({ message: 'Not authorized'})
            }

            next();
        } catch (error) {
            console.error('Not Authorized', error)
            res.status(401).json({ message: 'Not authorized' })
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token')
    }
});

module.exports = { 
    protect,
    adminProtect,
    facultyProtect,
    adminAndFacultyProtect
 }