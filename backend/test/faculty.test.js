const {getAllFaculty} = require('../controllers/facultyController'); // Import the function to be tested
const Faculty = require('../models/facultyModel'); // Import the Faculty model

// Mock the request and response objects
const req = {};
const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

// Mock the Faculty model methods
jest.mock('../models/facultyModel', () => ({
  find: jest.fn().mockResolvedValue([]), // Mock no faculty members found
}));

describe('getAllFaculty', () => {
  it('should return all faculty members', async () => {
    // Call the function with the mocked request and response objects
    await getAllFaculty(req, res);

    // Verify that the Faculty model method was called
    expect(Faculty.find).toHaveBeenCalled();

    // Verify that the response status and JSON were called with the correct data
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([]);
  });

});

