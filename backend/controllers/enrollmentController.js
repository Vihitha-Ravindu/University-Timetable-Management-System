const asyncHandler = require('express-async-handler')
const Enrollment = require('../models/enrollModel')
const User = require('../models/studentModel')

// @desc get enrollment
// @route POST /api/enroll
// @access Private
const getAllEnrollments = async (req, res) => {
    try {
        // Retrieve all enrollments
        const enrollments = await Enrollment.find()

        res.status(200).json(enrollments)
    } catch (error) {
        console.error('Error retrieving all enrollments:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

// @desc get enrollment by students
// @route POST /api/enroll/senrol
// @access Private
const getStudentEnrollments = async (req, res) => {
    try {
        // Retrieve all enrollments
        const enrollments = await Enrollment.find({student: req.user.id})

        res.status(200).json(enrollments)
    } catch (error) {
        console.error('Error retrieving all enrollments:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}



// @desc Set enrollment
// @route POST /api/enroll/:id
// @access Private
const enrollStudent = async (req, res) => {
    try {
        const { studentId, courseId } = req.body;

        // Check if the student is already enrolled in the course
        const existingEnrollment = await Enrollment.findOne({ student: studentId, course: courseId })
        if (existingEnrollment) {
            return res.status(400).json({ message: 'Student is already enrolled in the course' })
        }

        // Create a new enrollment
        const newEnrollment = await Enrollment.create({ student: studentId, course: courseId })

        res.status(201).json(newEnrollment);
    } catch (error) {
        console.error('Error enrolling student in a course:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// @desc delete enrollment
// @route DELETE /api/enroll/senrol/:id
// @access Private
const cancelStudentEnrollment = async (req, res) => {
    try {
        const enrollmentId = req.params.id;

        // Delete the enrollment
        const enrollment = await Enrollment.findById(enrollmentId);

        //check wether the room was available
        if(!enrollment){
             return res.status(404).json({ message: 'Enrollment not found'})
        }

        const user = await User.findById(req.user.id)

        if(!user){
            return res.status(401).json({ message: 'User not found'})
        }

        //check wether enrolement belong to current user
        if(enrollment.student.toString() !== user.id){
            return res.status(401).json({ message: 'User not authorized'})
        }

        //delete the enrolment
        const deletedenrollment = await Enrollment.findByIdAndDelete(enrollmentId);

        if(!deletedenrollment){
            return res.status(404).json({ message: 'Enrollment not found'})
       }

        res.status(200).json({ message: 'Enrollment cancelled successfully' });

    } catch (error) {
        console.error('Error cancelling enrollment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// @desc delete enrollment
// @route DELETE /api/enroll/:id
// @access Private
const cancelEnrollment = async (req, res) => {
    try {
        const enrollmentId = req.params.id;

        // Delete the enrollment
        const deletedenrollment = await Enrollment.findByIdAndDelete(enrollmentId);

        //check wether the room was available
        if(!deletedenrollment){
             return res.status(404).json({ message: 'Enrollment not found'})
        }

        res.status(200).json({ message: 'Enrollment cancelled successfully' });

    } catch (error) {
        console.error('Error cancelling enrollment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



module.exports = {
    getAllEnrollments,
    enrollStudent,
    cancelEnrollment,
    getStudentEnrollments,
    cancelStudentEnrollment
}