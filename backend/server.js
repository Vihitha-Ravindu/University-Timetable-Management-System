const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv').config()
const { errorHandler } = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const port = process.env.PORT || 5000

connectDB()

//initializing the application.
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: false}))


app.use('/api/course', require('./routes/courseRoutes'))//API end points for course
app.use('/api/timetable', require('./routes/timetableRoutes'))//API end points for timeTable
app.use('/api/room', require('./routes/roomRoutes'))//API end points for rooms
app.use('/api/booking', require('./routes/bookingRoutes'))//API end points for bookings
app.use('/api/student', require('./routes/studentRoutes'))//API end points for students
app.use('/api/enroll', require('./routes/enrollmentRoutes'))//API end points for enrollments
app.use('/api/admin', require('./routes/adminRoutes'))//API end points for admin
app.use('/api/faculty', require('./routes/facultyRoutes'))//API end points for faculty
app.use('/api/notifications', require('./routes/notificationRoutes'))//API end points for notification


//customized error handler
app.use(errorHandler)

//setup the port
app.listen(port, () => console.log(`server started on port ${port}`.bgMagenta.italic))