require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const Content = require('../models/contentModel');
const User = require('../models/userModel');



let adminToken;

beforeAll(async () => {
  // Connect to MongoDB
  await mongoose.connect(process.env.MONGO_URL, { dbName: 'test'});

  // Clear the database
  await User.deleteMany({});
  await Content.deleteMany({});

  // Create an admin user and get the token
  const res = await request(process.env.API_URL)
    .post('/api/auth/register')
    .send({
      username: 'admin',
      password: 'adminpassword'
    });

  adminToken = res.body.token;
});

afterAll(async () => {
    await mongoose.connection.close();
  });

describe('Content API', () => {
  let contentId;

  describe('POST /api/contents', () => {
    it('should create a new content', async () => {
      const res = await request(process.env.API_URL)
        .post('/api/contents')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Sample Content',
          category: 'Education',
          thumbnailUrl: 'http://example.com/thumbnail.jpg',
          type: 'text',
          readerStat: 100,
          readingStat: 50,
          author: 'John Doe',
          publicationDate: '2023-01-01',
        })
        .expect(201);

      contentId = res.body._id;
      expect(res.body.title).toBe('Sample Content');
      expect(res.body.category).toBe('Education');
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request(process.env.API_URL)
        .post('/api/contents')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          category: 'Education',
          thumbnailUrl: 'http://example.com/thumbnail.jpg',
          type: 'text',
          readerStat: 100,
          readingStat: 50,
          author: 'John Doe',
          publicationDate: '2023-01-01',
        })
        .expect(400);

      expect(res.body.message).toContain("Oops! You forgot the title. It's like a book with no cover!");
    });
  });

  describe('GET /api/contents', () => {
    it('should retrieve all contents', async () => {
      const res = await request(process.env.API_URL).get('/api/contents').set('Authorization', `Bearer ${adminToken}`).expect(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0]._id).toEqual(contentId);
    });
  });

  describe('GET /api/contents/:id', () => {
    it('should retrieve a content by ID', async () => {
      const res = await request(process.env.API_URL).get(`/api/contents/${contentId}`).set('Authorization', `Bearer ${adminToken}`).expect(200);
      expect(res.body._id).toEqual(contentId);
    });

    it('should return 404 for non-existent content', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      await request(process.env.API_URL).get(`/api/contents/${nonExistentId}`).set('Authorization', `Bearer ${adminToken}`).expect(404);
    });
  });

  describe('GET /api/contents/category/:category', () => {
    it('should retrieve contents by category', async () => {
      const res = await request(process.env.API_URL).get('/api/contents/category/Education').set('Authorization', `Bearer ${adminToken}`).expect(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].category).toBe('Education');
    });
  });

  describe('GET /api/contents/type/:type', () => {
    it('should retrieve contents by type', async () => {
      const res = await request(process.env.API_URL).get('/api/contents/type/text').set('Authorization', `Bearer ${adminToken}`).expect(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].type).toBe('text');
    });
  });

  describe('PUT /api/contents/:id', () => {
    it('should update a content', async () => {
      const res = await request(process.env.API_URL)
        .put(`/api/contents/${contentId}`).set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Updated Content Title',
          category: 'Science',
          thumbnailUrl: 'http://example.com/new-thumbnail.jpg',
        })
        .expect(200);

      expect(res.body.title).toBe('Updated Content Title');
      expect(res.body.category).toBe('Science');
    });

    it('should return 404 for non-existent content', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      await request(process.env.API_URL)
        .put(`/api/contents/${nonExistentId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Updated Content Title',
          category: 'Science',
          thumbnailUrl: 'http://example.com/new-thumbnail.jpg',
        })
        .expect(404);
    });
  });

  describe('DELETE /api/contents/:id', () => {
    it('should delete a content', async () => {
      await request(process.env.API_URL).delete(`/api/contents/${contentId}`).set('Authorization', `Bearer ${adminToken}`).expect(204);
    });

    it('should return 404 for non-existent content', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      await request(process.env.API_URL).delete(`/api/contents/${nonExistentId}`).set('Authorization', `Bearer ${adminToken}`).expect(404);
    });
  });
});
