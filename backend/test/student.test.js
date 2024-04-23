const {updateUser} = require('../controllers/studentController'); // Import the function to be tested
const User = require('../models/studentModel'); // Import the User model

// Mock the request and response objects
const req = {
  user: 'userId',
  body: {
    name: 'Updated Name',
    email: 'updated@example.com',
    password: 'newpassword',
    role: 'admin',
  },
};
const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

// Mock the User model methods
jest.mock('../models/studentModel', () => ({
  findById: jest.fn().mockResolvedValue({
    _id: 'userId',
    name: 'Old Name',
    email: 'old@example.com',
    password: 'oldhashedpassword',
    role: 'user',
    save: jest.fn().mockResolvedValue({
      _id: 'userId',
      name: 'Updated Name',
      email: 'updated@example.com',
      role: 'admin',
    }),
  }),
}));

describe('updateUser', () => {
  it('should update the user', async () => {
    // Call the function with the mocked request and response objects
    await updateUser(req, res);

    // Verify that User.findById was called with the correct user ID
    expect(User.findById).toHaveBeenCalledWith('userId');

    // Verify that the user fields were updated correctly
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      _id: 'userId',
      name: 'Updated Name',
      email: 'updated@example.com',
      role: 'admin',
    });
  });
});