const asyncHandler = require('express-async-handler')
const Timetable = require('../models/timetableModel')
const Course = require('../models/courseModel')
const Notification = require('../models/notificationmodel')


// @desc Get timetable
// @route GET /api/timetable/:courseId
// @access Private.
const getTimetable = asyncHandler(async(req, res) =>{
    try {
        const courseId = req.params.id
        const sessions = await Timetable.find({ course: courseId}).populate('course')

        //check if there is any existing sessins for the given course
        if(sessions.length == 0){
            return res.status(404).json({ message: 'No Timetable sessions found for the given course'})
        }

        res.status(200).json(sessions)
        
    } catch (error) {
        console.error('Error retrieving sessions', error)
        res.status(500).json({ message: 'Internal server error'})
    }
})

// @desc Get timetable
// @route GET /api/timetable
// @access Private.
const getTimtables = asyncHandler(async(req, res) => {
    try{
        const sessions = await Timetable.find().populate('course', 'name code')

        if(sessions.length == 0){
            return res.status(404).json({ message: 'No timetable sessions found'})
        }

        //group sessions according to the course
        const groupedSessions = {}
        sessions.forEach(session => {
            const courseCode = session.course.code
            //check if the group of course already exists 
            //if not create a new group giving the course name and course code
            if(!groupedSessions[courseCode]){
                groupedSessions[courseCode] = {
                    name: session.course.name,
                    code: courseCode,
                    sessions: [session]
                }
            }
            //if group exists simply add the session to that group
            else{
                groupedSessions[courseCode].sessions.push(session)
            }
        })

        //convert the objects into a array
        const groupedSessionsArray = Object.values(groupedSessions)

        res.status(200).json(groupedSessionsArray)
            
        }catch(error){
            console.error('Error retrieving sessions', error)
            res.status(500).json({ message: 'Internal server error'})
        }
    
})

// @desc Set session
// @route POST /api/timetable
// @access Private
const setSession = asyncHandler(async(req, res) => {
    try {
        const { courseId, nday, starttime, endtime, faculty, location } = req.body

        const course = await Course.findById(courseId)

        //check if the course exists
        if(!course){
            return res.status(404).json({ message: 'Course not found'})
        }

        //check for overlapping sessions
        const existingSessions = await Timetable.find({
            course: courseId,
            day: nday,
            $or: [
                { $and: [{ startTime: {$lte: starttime}}, {endTime: {$gte: endtime}}]},//new session starts within the existing session
                { $and: [{ starttime: {$lt: endtime}}, { endTime: {$gte: endtime}}]},//New sesion end within a existing session
                { $and: [{ startTime: {$gte: starttime}}, { endTime: {$lte: endtime}}]}//existing session lies within the new session
            ]
        })

        if(existingSessions.length > 0){
            return res.status(400).json({ message: 'Overlapping sessions'})
        }

        //creating new session
        const newSession = await Timetable.create({
            course: courseId,
            day: nday,
            startTime: starttime,
            endTime: endtime,
            faculty: faculty,
            location: location
        })

        res.status(201).json(newSession)


        
    } catch (error) {
        console.error('Error creating session:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

// @desc Update session
// @route PUT /api/timetable/:id
// @access Private
const updateSession = asyncHandler(async(req, res) => {
    try {
        const session = await Timetable.findById(req.params.id)

        //checking the session is available
        if(!session){
            return res.status(404).json({ message: 'Session not found'})
        }

        //getting the data from the body
        const { courseId, day, starttime, endtime, faculty, location } = req.body
        //validate required fields
        if (!courseId || !day || !starttime || !endtime  || !location) {
            return res.status(400).json({ message: 'Course ID, day, start time, faculty , location and end time are required' });
        }
        
        //check for overlapping sessins
        const existingSessions = await Timetable.find({
            course: courseId,
            day,
            _id: { $ne: req.params.id },//excluding the current session
            $or: [
                { $and: [{ startTime: {$lte: starttime}}, { endTime: {$gte: endtime}}]},//new session starts within the existing session
                { $and: [{ startTime: {$lt: endtime}}, { endtime: {$gte: endtime}}]},//New sesion end within a existing session
                { $and: [{ startTime: {$gte: starttime}}, { endTime: {$lte: endtime}}]}//existing session lies within the new session
            ]
        })

        if(existingSessions.length > 0){
            return res.status(400).json({ message: 'Overlapping sessions'})
        }

        //update the session
        const updatedSession = await Timetable.findByIdAndUpdate(req.params.id, req.body,{
            new: true,
        })

        // Create a notification for the session update
        const notification = await Notification.create({
            title: 'Change of TimeTable session',
            type: 'timetable_change',
            message: `Session ${req.params.id} has been updated. Course: ${courseId}, Day: ${day}, Start Time: ${starttime}, End Time: ${endtime}`,
            
        });

        res.status(200).json(updatedSession)

        
    } catch (error) {
        console.error('Error updating session:', error);
        res.status(500).json({ message: 'Internal server error' })
    }
})

// @desc Delete session
// @route DELETE /api/timetable/:id
// @access Private
const deleteSession = asyncHandler(async(req, res) =>{
    try {
        const session = await Timetable.findByIdAndDelete(req.params.id)

        if (!session) {
            return res.status(404).json({ message: 'Session not found' })
        }

        res.status(200).json({ id: req.params.id, message: 'Session deleted successfully' })

    } catch (error) {
        console.error('Error deleting session:', error);
        res.status(500).json({ message: 'Internal server error' })
    }
})

module.exports = {
    getTimetable,
    getTimtables,
    setSession,
    updateSession,
    deleteSession
}