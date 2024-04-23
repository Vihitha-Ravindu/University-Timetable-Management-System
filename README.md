[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/MhkFIDKy)

# University Timetable Management System

## Description
The University Timetable Management System is a web application designed to streamline the scheduling and management of university courses, faculty, rooms, and enrollments. It provides administrators with a centralized platform to create, update, and delete course schedules, allocate faculty members, manage room bookings, and handle student enrollments.

## Setup Instructions
To set up the University Timetable Management System on your local machine, follow these steps:

1. Clone the Repository using the command:
git clone https://github.com/sliitcsse/assignment-01-Vihitha-Ravindu.git
2. Open the cloned project in VSCode.
3. Install the dependencies required for the project using the command:
npm install
4. Start the server using the command:
npm run server
5. Once the server is started, the project will be connected to the database.
6. You can use the backend services using software such as POSTMAN using the URL: http://localhost:5000

## API Endpoint Documentation

### Admin
- **GET /api/admin**: Get Admin
- **POST /api/admin**: Register Admin
- **PUT /api/admin**: Update an existing Admin
- **DELETE /api/admin**: Delete an Admin
- **POST /api/admin/adminlog**: Admin login

### Student
- **GET /api/student/me**: Get Student
- **GET /api/student**: Get Students
- **POST /api/student**: Register Student
- **PUT /api/student**: Update an existing Student
- **DELETE /api/student/:id**: Delete Student
- **POST /api/student/login**: Student login

### Faculty
- **GET /api/faculty**: Get all Faculty
- **POST /api/faculty**: Register Faculty
- **PUT /api/faculty**: Update an existing Faculty
- **DELETE /api/faculty/:id**: Delete Faculty
- **POST /api/faculty/flogin**: Faculty login

### Courses
- **GET /api/course**: Get all courses
- **POST /api/course**: Create a new course
- **PUT /api/course/:id**: Update an existing course
- **DELETE /api/course/:id**: Delete a course

### Rooms
- **GET /api/room**: Get all rooms
- **GET /api/room/:id**: Get specific room
- **POST /api/room**: Create a new room
- **PUT /api/room/:id**: Update an existing room
- **DELETE /api/room/:id**: Delete a room

### Enrollments
- **GET /api/enroll**: Get all enrollments
- **GET /api/enroll/senrol**: Get student’s enrollments
- **POST /api/enroll**: Create a new enrollment
- **DELETE /api/enroll/:id**: Delete an enrollment
- **DELETE /api/enroll/senrol/:id**: Delete student’s enrollment

### Bookings
- **GET /api/booking**: Retrieve all bookings
- **POST /api/booking**: Create a new booking
- **PUT /api/booking/:id**: Update an existing booking
- **DELETE /api/booking/:id**: Delete a booking
- **GET /api/booking/searchCourse/:id**: Retrieve all bookings by course
- **GET /api/booking/searchRoom/:id**: Retrieve all bookings by room

### Timetable
- **GET /api/timetable**: Retrieve all timetable sessions
- **GET /api/timetable/:id**: Retrieve all timetable sessions by course
- **POST /api/timetable**: Create a new timetable session
- **PUT /api/timetable/:id**: Update an existing timetable session
- **DELETE /api/timetable/:id**: Delete a timetable session

### Notifications
- **GET /api/notifications**: Retrieve all notifications
- **POST /api/notifications**: Create a new notification
- **GET /api/notifications/notify**: Retrieve all notifications within 2 days

## Testing

### Unit Testing
Unit tests are located in the `test` directory within the project. To run the unit tests, use the command:
npm test

### Integration Testing

Integration testing was performed using POSTMAN. Utilize the provided API endpoints to conduct integration tests for each function.

**Important:** Since most endpoints are protected and access levels vary among users, ensure you are logged in as the correct authorized user to test any function.

### Security Testing

Security testing was conducted using OWASP ZAP software. Follow these steps to perform security testing:

1. Install OWASP ZAP software.
2. Configure the local proxy to port 5000.
3. Access the application via `http://localhost:5000`.
4. Initiate scanning to evaluate security vulnerabilities.
