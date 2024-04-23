const {createNotification} = require('../controllers/notificationController'); // Import the function to be tested
const Notification = require('../models/notificationmodel'); // Import the Notification model

// Mock the request and response objects
const req = {
  body: {
    title: 'Test Notification',
    type: 'test',
    message: 'This is a test notification',
  },
};
const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

// Mock the Notification model methods
jest.mock('../models/notificationmodel', () => ({
  create: jest.fn().mockResolvedValue({
    _id: 'notificationId',
    title: 'Test Notification',
    type: 'test',
    message: 'This is a test notification',
  }),
}));

describe('createNotification', () => {
  it('should create a notification', async () => {
    // Call the function with the mocked request and response objects
    await createNotification(req, res);

    // Verify that the Notification model method was called with the correct data
    expect(Notification.create).toHaveBeenCalledWith({
      title: 'Test Notification',
      type: 'test',
      message: 'This is a test notification',
    });

    // Verify that the created notification is returned
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      _id: 'notificationId',
      title: 'Test Notification',
      type: 'test',
      message: 'This is a test notification',
    });
  });

});