const {updateSession} = require('../controllers/timetableController'); // Import the function to be tested
const Timetable = require('../models/timetableModel'); // Import the Timetable model
const Notification = require('../models/notificationmodel'); // Import the Notification model

// Mock the request and response objects
const req = {
  params: { id: 'sessionId' },
  body: {
    courseId: 'courseId',
    day: 'Monday',
    starttime: '09:00',
    endtime: '11:00',
    faculty: 'facultyId',
    location: 'Room 101',
  },
};
const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

// Mock the Timetable and Notification model methods
jest.mock('../models/timetableModel', () => ({
  findById: jest.fn().mockResolvedValue({
    _id: 'sessionId',
    course: 'oldCourseId',
    day: 'Monday',
    startTime: '08:00',
    endTime: '10:00',
    faculty: 'oldFacultyId',
    location: 'Room 101',
  }),
  find: jest.fn().mockResolvedValue([]),
  findByIdAndUpdate: jest.fn().mockResolvedValue({
    _id: 'sessionId',
    course: 'courseId',
    day: 'Monday',
    startTime: '09:00',
    endTime: '11:00',
    faculty: 'facultyId',
    location: 'Room 101',
  }),
}));
jest.mock('../models/notificationmodel', () => ({
  create: jest.fn().mockResolvedValue({
    title: 'Change of TimeTable session',
    type: 'timetable_change',
    message: 'Session sessionId has been updated. Course: courseId, Day: Monday, Start Time: 09:00, End Time: 11:00',
  }),
}));

describe('updateSession', () => {
  it('should update the session and create a notification', async () => {
    // Call the function with the mocked request and response objects
    await updateSession(req, res);

    // Verify that Timetable.findById was called with the correct session ID
    expect(Timetable.findById).toHaveBeenCalledWith('sessionId');

    // Verify that the session was updated correctly
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      _id: 'sessionId',
      course: 'courseId',
      day: 'Monday',
      startTime: '09:00',
      endTime: '11:00',
      faculty: 'facultyId',
      location: 'Room 101',
    });

    // Verify that Notification.create was called with the correct parameters
    expect(Notification.create).toHaveBeenCalledWith({
      title: 'Change of TimeTable session',
      type: 'timetable_change',
      message: 'Session sessionId has been updated. Course: courseId, Day: Monday, Start Time: 09:00, End Time: 11:00',
    });
  });

 
});