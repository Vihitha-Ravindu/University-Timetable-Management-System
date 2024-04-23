const asyncHandler = require('express-async-handler')

const Course = require('../models/courseModel')

// @desc Get courses
// @route GET /api/courses
// @access Private
const getCourse = asyncHandler(async (req, res) => {
    try {
        const course = await Course.find();
        res.status(200).json(course);
    } catch (error) {
        console.error('Error getting courses:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// @desc Set goals
// @route POST /api/courses
// @access Private
const setCourse = asyncHandler(async (req, res) => {
    try {
        //check wether name is given
        if (!req.body.name) {
            res.status(400);
            throw new Error('Please specify the course name');
        }

        //create new course
        const course = await Course.create({
            name: req.body.name,
            code: req.body.code,
            description: req.body.description,
            credits: req.body.credits,
            faculty: req.body.faculty
        });

        res.status(200).json(course);
    } catch (error) {
        console.error('Error setting course:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// @desc Update course
// @route PUT /api/courses/:id
// @access Private
const updateCourse = asyncHandler(async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        //check wether course exists
        if (!course) {
            res.status(400);
            throw new Error('Course not found');
        }

        //update the course
        const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        res.status(200).json(updatedCourse);
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// @desc Delete course
// @route DELETE /api/courses/:id
// @access Private
const deleteCourse = asyncHandler(async (req, res) => {
    try {
        //delete the course
        const deletedCourse = await Course.findByIdAndDelete(req.params.id);

        if (!deletedCourse) {
            res.status(400);
            throw new Error('Course not found');
        }

        res.status(200).json({ id: req.params.id, message: 'Course deleted successfully' });
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = {
    getCourse,
    setCourse,
    updateCourse,
    deleteCourse
}