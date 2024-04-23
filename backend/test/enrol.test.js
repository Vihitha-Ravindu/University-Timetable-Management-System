// Import the function to be tested
const { getAllEnrollments } = require('../controllers/enrollmentController');

// Mock the Enrollment model
const Enrollment = require('../models/enrollModel');

// Mock the request and response objects
const req = {};
const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe('getAllEnrollments', () => {
  it('should return all enrollments', async () => {
    // Mock the data returned by the Enrollment model
    const mockEnrollments = [{ student: 'John Doe', course: 'Math' }, { student: 'Jane Doe', course: 'Science' }];
    Enrollment.find = jest.fn().mockResolvedValue(mockEnrollments);

    // Call the function
    await getAllEnrollments(req, res);

    // Check if the response is correct
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockEnrollments);
  });

  it('should handle errors', async () => {
    // Mock error message
    const errorMessage = 'Database error';
    Enrollment.find = jest.fn().mockRejectedValue(new Error(errorMessage));

    // Call the function
    await getAllEnrollments(req, res);

    // Check if the error response is correct
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
});