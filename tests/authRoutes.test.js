require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const User = require('../models/userModel');

beforeAll(async () => {
  // Connect to MongoDB
  await mongoose.connect(process.env.MONGO_URL);

  // Clear the database
  await User.deleteMany({});
});

afterAll(async () => {
  // Disconnect from MongoDB
  await mongoose.connection.close();
});

describe('Auth API', () => {
  it('should register a new user', async () => {
    const res = await request(process.env.API_URL)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        password: 'testpassword'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should login a user', async () => {
    const res = await request(process.env.API_URL)
      .post('/api/auth/login')
      .send({
        username: 'testuser',
        password: 'testpassword'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not login with wrong credentials', async () => {
    const res = await request(process.env.API_URL)
      .post('/api/auth/login')
      .send({
        username: 'testuser',
        password: 'wrongpassword'
      });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('error');
  });
});
