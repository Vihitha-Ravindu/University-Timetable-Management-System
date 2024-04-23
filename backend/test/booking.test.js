const {updateBooking} = require('../controllers/bookingController'); // Import the function to be tested
const Booking = require('../models/bookingModel'); // Import the Booking model
const Notification = require('../models/notificationmodel'); // Import the Notification model

// Mock the request and response objects
const req = {
  params: {
    id: 'booking_id', // Replace 'booking_id' with an actual booking ID
  },
  body: {
    room: 'Room 1',
    day: 'Monday',
    starttime: '09:00',
    endtime: '11:00',
    course: 'Course 1',
    user: 'User 1',
  },
};

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

// Mock the Booking model methods
jest.mock('../models/bookingModel', () => ({
  findById: jest.fn().mockResolvedValue({
    // Mock the found booking object
    _id: 'booking_id',
    // Add other properties as needed
  }),
  find: jest.fn().mockResolvedValue([]), // Mock no existing bookings
  findByIdAndUpdate: jest.fn().mockImplementation((id, data) => Promise.resolve({ _id: id, ...data })),
}));

// Mock the Notification model methods
jest.mock('../models/notificationmodel', () => ({
  create: jest.fn().mockImplementation((data) => Promise.resolve(data)),
}));

describe('updateBooking', () => {
  it('should update booking and create notification', async () => {
    // Call the function with the mocked request and response objects
    await updateBooking(req, res);

    // Verify that the Booking model methods were called with the correct parameters
    expect(Booking.findById).toHaveBeenCalledWith('booking_id');
    expect(Booking.findByIdAndUpdate).toHaveBeenCalledWith('booking_id', req.body, { new: true });

    // Verify that the Notification model method was called with the correct parameters
    expect(Notification.create).toHaveBeenCalledWith({
      title: 'Change of TimeTable  session',
      type: 'timetable_change',
      message: `Session booking_id has been updated. Course: Course 1, Day: Monday, Start Time: 09:00, End Time: 11:00`,
    });

    // Verify that the response status and JSON were called with the correct data
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ _id: 'booking_id', ...req.body });
  });

 
});