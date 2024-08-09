require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const User = require('../models/userModel');
const Event = require('../models/eventModel');
const faker = require('faker');

let adminToken;

beforeAll(async () => {
  // Connect to MongoDB
  await mongoose.connect(process.env.MONGO_URL, { dbName: 'test'});

  // Clear the database
  await User.deleteMany({});
  await Event.deleteMany({});

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

  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe('Event API', () => {
  let eventId;

  beforeEach(async () => {
    const newEvent = {
      coverImageUrl: 'http://example.com/cover.jpg',
      title: 'Sample Event',
      author: 'Admin',
      location: 'Nice Bar',
      address: '123 Sample Street',
      city: 'Sample City',
      dateTime: faker.date.future(),
      formattedDate: new Date().toLocaleString(),
      status: 'free',
      price: 0,
      about: '## Sample Markdown\n\nThis is a sample event description.',
      type: 'intern',
      ticketingUrl: 'http://example.com/tickets',
      maxTicket: 100,
      numberofInterrested: 50,
      numberTicketsSold: 30,
      attendees: [1,2,3]
    };

    const res = await request(process.env.API_URL)
      .post('/api/events')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newEvent);

    eventId = res.body._id;
  });


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////// CREATE /events/ //////////////////////////////////////////////////////////////////


  it('should create a new event', async () => {
    const newEvent = {
      coverImageUrl: 'http://example.com/cover.jpg',
      title: 'Sample Event',
      author: 'Admin',
      location: 'Nice Bar',
      address: '123 Sample Street',
      city: 'Sample City',
      dateTime: faker.date.past(),
      formattedDate: new Date().toLocaleString(),
      status: 'free',
      price: 0,
      about: '## Sample Markdown\n\nThis is a sample event description.',
      type: 'intern',
      ticketingUrl: 'http://example.com/tickets',
      maxTicket: 100,
      numberofInterrested: 50,
      numberTicketsSold: 30,
      attendees: [1,2,3]
    };

    const res = await request(process.env.API_URL)
      .post('/api/events')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newEvent);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.title).toBe(newEvent.title);
  });

  it('should create a new free event without pricing', async () => {
    const newEvent = {
      coverImageUrl: 'http://example.com/cover.jpg',
      title: 'Sample Event',
      author: 'Admin',
      location: 'Nice Bar',
      address: '123 Sample Street',
      city: 'Sample City',
      dateTime: faker.date.future(),
      formattedDate: new Date().toLocaleString(),
      status: 'free',
      about: '## Sample Markdown\n\nThis is a sample event description.',
      type: 'intern',
      ticketingUrl: 'http://example.com/tickets',
      maxTicket: 100,
      numberofInterrested: 50,
      numberTicketsSold: 30,
      attendees: []
    };

    const res = await request(process.env.API_URL)
      .post('/api/events')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newEvent);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.title).toBe(newEvent.title);
  });

  it('should return error when creating event with missing fields', async () => {
    const newEvent = {
      title: 'Invalid Event'
      // Missing required fields
    };

    const res = await request(process.env.API_URL)
      .post('/api/events')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newEvent);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////// GET /events/ //////////////////////////////////////////////////////////////////


  it('should retrieve a list of events', async () => {
    const res = await request(process.env.API_URL)
      .get('/api/events')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should return error when retrieving events with invalid token', async () => {
    const res = await request(process.env.API_URL)
      .get('/api/events')
      .set('Authorization', `Bearer invalidtoken`);

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  it('should retrieve all events', async () => {
    const res = await request(process.env.API_URL)
      .get('/api/events')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should return error when retrieving all events with invalid token', async () => {
    const res = await request(process.env.API_URL)
      .get('/api/events')
      .set('Authorization', `Bearer invalidtoken`);

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////// GET /events/:id //////////////////////////////////////////////////////////////////


  it('should retrieve an event by ID', async () => {
    const res = await request(process.env.API_URL)
      .get(`/api/events/${eventId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id', eventId);
  });

  it('should return error when retrieving invalid ID', async () => {
    const res = await request(process.env.API_URL)
      .get('/api/events/invalidId')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should return error when retrieving non-existent event by ID', async () => {
    const res = await request(process.env.API_URL)
      .get('/api/events/41224d776a326fb40f000001')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////// UPDATE /events/:id //////////////////////////////////////////////////////////////////

  it('should update an event', async () => {
    const updateData = {
      title: 'Updated Event Title'
    };

    const res = await request(process.env.API_URL)
      .put(`/api/events/${eventId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(updateData);

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe(updateData.title);
  });

  it('should return error when invalid event id', async () => {
    const updateData = {
      title: 'Non-existent Event'
    };

    const res = await request(process.env.API_URL)
      .put('/api/events/invalidId')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(updateData);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should return error when updating non-existent event', async () => {
    const updateData = {
      title: 'Non-existent Event'
    };

    const res = await request(process.env.API_URL)
      .put('/api/events/41224d776a326fb40f000001')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(updateData);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////// DELETE /events/:id //////////////////////////////////////////////////////////////////

  it('should delete an event', async () => {
    const res = await request(process.env.API_URL)
      .delete(`/api/events/${eventId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(204);
  });

  it('should return error when deleting non-existent event', async () => {
    const res = await request(process.env.API_URL)
      .delete('/api/events/invalidId')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////// GET /search //////////////////////////////////////////////////////////////////

  it('should search events by city', async () => {
    const res = await request(process.env.API_URL)
      .get('/api/events/search')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ city: 'Sample City'});

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].city).toBe('Sample City');
  });

  it('should return error when searching events with invalid pancake parameter', async () => {
    const res = await request(process.env.API_URL)
      .get('/api/events/search')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({pancake: "fluffy"});

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('should find no event with this filter', async () => {
    const res = await request(process.env.API_URL)
      .get('/api/events/search')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ city: 'Paris'});

    expect(res.statusCode).toBe(204);
  });


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////// /events/upcoming //////////////////////////////////////////////////////////////////

  it('should retrieve upcoming events', async () => {
    const res = await request(process.env.API_URL)
      .get('/api/events/upcoming')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should return error when retrieving upcoming events with invalid token', async () => {
    const res = await request(process.env.API_URL)
      .get('/api/events/upcoming')
      .set('Authorization', `Bearer invalidtoken`);

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////// GET events/past /////////////////////////////////////////////////////////////////////

  it('should retrieve past events', async () => {
    const res = await request(process.env.API_URL)
      .get('/api/events/past')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    // Add logic to ensure at least one past event if applicable
  });

  it('should return error when retrieving past events with invalid token', async () => {
    const res = await request(process.env.API_URL)
      .get('/api/events/past')
      .set('Authorization', `Bearer invalidtoken`);

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////// GET /EVENTS/:id/ATTENDEES /////////////////////////////////////////////////////////////

  it('should retrieve attendees of an event', async () => {
    const res = await request(process.env.API_URL)
      .get(`/api/events/${eventId}/attendees`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('attendees');
  });

  it('should return error when retrieving attendees of non-existent event', async () => {
    const res = await request(process.env.API_URL)
      .get('/api/events/invalidId/attendees')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////// GET /EVENTS/:id/INTERESTED /////////////////////////////////////////////////////////////

  it('should retrieve number of interested members for an event', async () => {
    const res = await request(process.env.API_URL)
      .get(`/api/events/${eventId}/interested`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('numberOfInterrested');
  });

  it('should return error when retrieving interested members of non-existent event', async () => {
    const res = await request(process.env.API_URL)
      .get('/api/events/invalidId/interested')
      .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error');
    });


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////// GET /EVENTS/:id/TICKETING /////////////////////////////////////////////////////////////
  
    it('should retrieve ticketing URL of an event', async () => {
      const res = await request(process.env.API_URL)
        .get(`/api/events/${eventId}/ticketingUrl`)
        .set('Authorization', `Bearer ${adminToken}`);
  
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('ticketingUrl');
    });
  
    it('should return error when retrieving ticketing URL of non-existent event', async () => {
      const res = await request(process.env.API_URL)
        .get('/api/events/invalidId/ticketingUrl')
        .set('Authorization', `Bearer ${adminToken}`);
  
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
    
});

   
